var util = require('util');

var parseModule = function(data, req, res){

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
    if (!data.license && !data.licenses){
      data.license = "unknown"
    }
    if (data.value === undefined){
      data.value = {
        passes: undefined
      };
    }
    if (data.licenses){
      var passes = true;
      for (var i=0; i<data.licenses.length; i++){
        if (rules[data.licenses[i].type] === false){
          passes = false;
          break;
        } else if (!rules[data.licenses[i].type] || rules[data.licenses[i].type] !== true){
          passes = "warn";
          break;
        }
      }
      data.value.passes = passes;
    } else if (data.license){
      if (rules[data.license] === true){
        data.value.passes = true;
      } else if (!rules[data.license] || rules[data.license] !== true){
        data.value.passes = "warn";
      } else {
        data.value.passes = false;
      }
    }
  };

  // Mark parent node safety status
  var markParentNode = function(parent, data){
    var currentParent = parent;
    if (!parent.value){
      parent.value = {
        passes: undefined
      }
    }
    if (data.value){
      if (data.value.passes !== true){
        while (currentParent){
          if (data.value.passes === false){
            parent.value.passes = false;
          } else if (data.value.passes === "warn" && parent.value && parent.value.passes !== false){
            parent.value.passes = "warn";
          }
          currentParent = parent.parent;
        }
      } else if (parent.value.passes === undefined){
        parent.value.passes = true;
      }
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

  var cache = [];
  modules = JSON.stringify(modules, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  });
  cache = null; // Enable garbage collection
  // console.log(modules)
  res.send(modules)
  // setTimeout(function(){res.send(modules);},3000);

  // // grunt-bump not being marked as passing or not
  // Object.keys(modules).forEach(function(key){
  //   if (modules[key].passes === undefined){
  //     console.log(util.inspect(modules[key], {depth: null}));
  //   }
  //   // console.log(key, newList[key].passes)
  // });

};

module.exports = function(data, req, res){ parseModule(data, req, res); };
