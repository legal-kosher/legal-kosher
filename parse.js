var util = require('util');

var parseModule = function(data){

  var modules = data.dependencies;

  var rules = {
    "MIT": true,
    "GPL": false
  };

  var Node = function(value, parent){
    this.value = value;
    this.parent = parent;
  };

  // If data.licenses and a license fails the test, mark warning
  var markNodeSafety = function(data){
    if (data.licenses){
      var passes = true;
      for (var i=0; i<data.licenses.length; i++){
        if (rules[data.licenses[i]] === false){
          passes = false;
          break;
        } else if (!rules[data.licenses[i]] || rules[data.licenses[i]] !== true){
          passes = "warn";
          break;
        }
      }
      data.passes = passes;
    } else if (data.license){
      if (rules[data.license] === true){
        data.passes = true;
      } else if (!rules[data.license] || rules[data.license] !== true){
        data.passes = "warn";
      } else {
        data.passes = false;
      }
    }
  };

  // Mark parent node safety status
  var markParentNode = function(parent, data){
    var currentParent = parent;
    if (data.passes !== true){
      while (currentParent){
        if (data.passes === false){
          parent.passes = false;
        } else if (data.passes === "warn" && parent.value && parent.passes !== false){
          parent.passes = "warn";
        }
        currentParent = parent.parent;
      }
    } else if (!parent.passes){
      parent.passes = true;
    }
  };

  var makeNode = function(name, data, parent){
    // Modify data object
    data.name = name;
    var dependencies = data.dependencies;
    data.dependencies = [];

    // Create child node for each dependency that points to data object as parent
    Object.keys(dependencies).forEach(function(depName){
      makeNode(depName, dependencies[depName], data);
    });

    // Determine data object safety
    markNodeSafety(data);

    if (parent){
      markParentNode(parent, data);
      // Create data node from data object and push to parent dependencies
      var node = new Node(data, parent);
      parent.dependencies.push(node);
    }
  }

  // Begin parsing data
  Object.keys(modules).forEach(function(modKey){
    makeNode(modKey, modules[modKey], null);
    // console.log(util.inspect(modules, {depth: null}));
  });

  // grunt-bump not being marked as passing or not
  Object.keys(modules).forEach(function(key){
    if (modules[key].passes === undefined){
      // console.log(newList[key])
      console.log(util.inspect(modules[key], {depth: null}));
    }
    // console.log(key, newList[key].passes)
  });

};

module.exports = function(data){ parseModule(data); };
