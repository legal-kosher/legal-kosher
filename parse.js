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

  var makeNode = function(name, data, parent){
    // console.log("name", name, "data", data, "parent", parent)
    // Modify data object
    data.name = name;
    var dependencies = data.dependencies;
    data.dependencies = [];

    // Create child node for each dependency that points to data object as parent
    Object.keys(dependencies).forEach(function(depName){
      var newNode = makeNode(depName, dependencies[depName], data);
      data.dependencies.push(newNode);
    });

    // Determine data object safety
    // If data.licenses and a license fails the test, mark warning
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

    // If data object unsafe, mark parent
    if (parent){
      if (data.passes === false){
        parent.value.passes = false;
      } else if (data.passes === "warn" && parent.value && parent.value.passes !== false){
        parent.value.passes = "warn";
      }

      // Create data node from data object and push to parent dependencies
      var node = new Node(data, parent);
      parent.dependencies.push(node);
    }

  }

  Object.keys(modules).forEach(function(modKey){
    makeNode(modKey, modules[modKey], null);
  });

  // console.log(util.inspect(modules, {depth: null}))
}

module.exports = function(data){ parseModule(data); };

