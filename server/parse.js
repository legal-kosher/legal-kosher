var util = require('util');
// var fs = require('fs');
var modules = {
  "module1": {
    "version": "4.0.2",
    "license": "MIT",
    "path": "legal-kosher/node_modules/module1",
    "dependencies": {
      "module2": {
        "version": "4.0.2",
        "license": "MIT",
        "path": "legal-kosher/node_modules/module2",
        "dependencies": {}
      },
      "module3": {
        "version": "4.0.2",
        "license": "MIT",
        "path": "legal-kosher/node_modules/module3",
        "dependencies": {
          "module7": {
            "version": "4.0.2",
            "license": "MIT",
            "path": "legal-kosher/node_modules/module7",
            "dependencies": {}
          }
        }
      }
    }
  },
  "module4": {
    "version": "4.0.2",
    "license": "MIT",
    "path": "legal-kosher/node_modules/module4",
    "dependencies": {
      "module5": {
        "version": "4.0.2",
        "license": "MIT",
        "path": "legal-kosher/node_modules/module5",
        "dependencies": {}
      },
      "module6": {
        "version": "4.0.2",
        "license": "MIT",
        "path": "legal-kosher/node_modules/module6",
        "dependencies": {
          "module8": {
            "version": "4.0.2",
            "license": "GPL",
            "path": "legal-kosher/node_modules/module8",
            "dependencies": {}
          }
        }
      }
    }
  }
};

// var List = function(){
//   this.head = null;
//   this.tail = null;
// };

var Node = function(value, parent){
  this.value = value;
  this.parent = parent;
};

var makeNode = function(name, data, parent){
  // Modify data
  data.name = name;
  var dependencies = data.dependencies;
  data.dependencies = [];
  // Create child node for each dependency that points to this node as parent
  Object.keys(dependencies).forEach(function(depName){
    var newNode = makeNode(depName, dependencies[depName], data);
    data.dependencies.push(newNode);
  });
  if (parent){
    var node = new Node(data, parent);
    if (rules[node.value.license] === true){
      node.value.passes = true;
    } else {
      node.value.passes = false;
      if(node.parent){
        node.parent.passes = false;
      }
    }
    parent.dependencies.push(node);
  }
}

var rules = {
  "MIT": true,
  "GPL": false
};


Object.keys(modules).forEach(function(modKey){
  // // Modify object at modKey
  // var dependencies = modules[modKey].dependencies;
  // modules[modKey].dependencies = [];
  
  // Object.keys(dependencies).forEach(function(depName){
  //   var newNode = makeNode(depName, dependencies[depName], modules[modKey]);
  //   // modules[modKey].dependencies.push(newNode);
  // });
  makeNode(modKey, modules[modKey], null);
});


console.log(util.inspect(modules, {depth: null}))


// var traceBadLicensePath = function(obj, parent, cb){
//   // Check all dependencies for pass/fail
//   cb = cb || null;
//   Object.keys(obj).forEach(function(key){
//     var dependency = obj[key];

//     // Check if dependency passes
//     if (rules[dependency.license] === false){
//       dependency.pass = false;
//       recordFail(parent);
//     } else {
//       dependency.pass = true;
//     }
//     // Recursively check all dependency children
//     traceBadLicensePath(dependency.dependencies, dependency);
//     // console.log(obj);
//   }.bind(parent));
//   if (cb){
//     console.log(modules)
//   }
// };

// Check path of each module
// traceBadLicensePath(modules);
