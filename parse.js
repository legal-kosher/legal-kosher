var util = require('util');

var parseModule = function(data) {
  var modules = data.dependencies;

  var rules = {
    "MIT": true,
    "GPL": false
  };

  // If data.licenses and a license fails the test, mark warning
  var markNodeSafety = function(data) {
    if (!data.license && !data.licenses) {
      data.license = "unknown"
    }
    if (data.licenses) {
      var passes = true;
      for (var i = 0; i < data.licenses.length; i++) {
        if (rules[data.licenses[i].type] === false) {
          passes = false;
          break;
        } else if (!rules[data.licenses[i].type] || rules[data.licenses[i].type] !== true) {
          passes = "warn";
          break;
        }
      }
      data.passes = passes;
    } else if (data.license) {
      if (rules[data.license] === true) {
        data.passes = true;
      } else if (!rules[data.license] || rules[data.license] !== true) {
        data.passes = "warn";
      } else {
        data.passes = false;
      }
    }
  };

  // Mark parent node safety status
  var markParentNode = function(parent, data) {
    if (data.passes === false) {
      parent.passes = false;
    } else if (data.passes === "warn" && parent.passes !== false) {
      parent.passes = "warn";
    }
    if (parent.parent) {
      markParentNode(parent.parent, data);
    }
  };

  var makeNode = function(name, data, parent) {
    // Modify data object
    data.name = name;
    var dependencies = data.dependencies;
    data.dependencies = [];
    data.parent = parent

    // Determine data object safety
    markNodeSafety(data);
    console.log(dependencies)
      // Create child node for each dependency that points to data object as parent
    Object.keys(dependencies).forEach(function(depName) {
      makeNode(depName, dependencies[depName], data);
    });


    if (parent) {
      markParentNode(parent, data);
      // Create data node from data object and push to parent dependencies
      var node = new Node(data, parent);
      parent.dependencies.push(node);
    }
  }

  // Begin parsing data
  Object.keys(modules).forEach(function(modKey) {
    makeNode(modKey, modules[modKey], null);
  });

  console.log(util.inspect(modules, {
    depth: null
  }));
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
  return modules;
  // setTimeout(function(){res.send(modules);},3000);

  // // grunt-bump not being marked as passing or not
  // Object.keys(modules).forEach(function(key){
  //   if (modules[key].passes === undefined){
  //     console.log(util.inspect(modules[key], {depth: null}));
  //   }
  //   // console.log(key, newList[key].passes)
  // });

};

module.exports = function(data) {
  parseModule(data);
};