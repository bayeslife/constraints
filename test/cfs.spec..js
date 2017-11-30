var assert = require('assert');

var constraints = require("../index.js");

var data =
[
  {
    "source": "{1D4CEFAF-95BC-47c4-A192-75EE5FB13D46}",
    "sourcename": "UFBAvailable",
    "sourceclass": "ServiceConstraint",
    "target": "{361005C0-FE79-4d18-A294-ED4131214A18}",
    "targetname": "Auckland",
    "targetclass": "Customer Location",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{1D4CEFAF-95BC-47c4-A192-75EE5FB13D46}",
    "sourcename": "UFBAvailable",
    "sourceclass": "ServiceConstraint",
    "target": "{59F49E48-5890-49a5-A9B9-046A1E2724C3}",
    "targetname": "Fixed Access",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{1D4CEFAF-95BC-47c4-A192-75EE5FB13D46}",
    "sourcename": "UFBAvailable",
    "sourceclass": "ServiceConstraint",
    "target": "{EF3C711F-3FE1-4214-A181-5DAD7B84F868}",
    "targetname": "Christchurch",
    "targetclass": "Customer Location",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{C104EA20-0BBB-4247-9367-3B75C6A13766}",
    "targetname": "Telephony",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{8C3BF873-9029-4d67-8332-EC12E77A5B1B}",
    "targetname": "meetingroom1@customer.co.nz",
    "targetclass": "userId",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{CDBA6ED3-EBC5-46de-9942-882E39DCDFC8}",
    "targetname": "jean.jones@customer.co.nz",
    "targetclass": "userId",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{9CBBB426-2EBF-4fad-A85F-93B0E5AEF3FD}",
    "targetname": "steve@supplier.co.nz",
    "targetclass": "userId",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{C0775155-E26C-484e-A1CD-87118C3E8718}",
    "targetname": "UC Access",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{EB9BDEAE-28D1-4a87-8013-9986B7AA0CE7}",
    "targetname": "jim.smith@supplier.co.nz",
    "targetclass": "userId",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{436F66D2-17F7-4b79-8FDC-5F27323299DC}",
    "targetname": "Sharing",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{616D629F-2594-4ca9-AE71-16542DCEDFB4}",
    "sourcename": "HumaneComputerInterface",
    "sourceclass": "ServiceConstraint",
    "target": "{D140E603-2292-460c-A3AD-28C618B3CA2A}",
    "targetname": "Presence",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{A60CD7B5-80ED-4c6c-8DD6-CDB8FE60E5D7}",
    "sourcename": "WifiEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "{5F71FEB0-85FF-4cf8-8E88-39A82E7196EF}",
    "targetname": "Tablet",
    "targetclass": "IPDevice",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{A60CD7B5-80ED-4c6c-8DD6-CDB8FE60E5D7}",
    "sourcename": "WifiEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "{3955217A-79B2-4f47-8CB4-05237F37CDAA}",
    "targetname": "Smart Phone",
    "targetclass": "IPDevice",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{A60CD7B5-80ED-4c6c-8DD6-CDB8FE60E5D7}",
    "sourcename": "WifiEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "CFSWIFI",
    "targetname": "WiFi",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{731AAAE6-F912-426d-98E9-FC527F7E80DD}",
    "sourcename": "LANEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "{8E0B1593-C775-48cc-9A04-88725F8762AB}",
    "targetname": "Personal Computer",
    "targetclass": "IPDevice",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{731AAAE6-F912-426d-98E9-FC527F7E80DD}",
    "sourcename": "LANEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "{1C3765FD-89E8-4eb8-9637-24298738E3CE}",
    "targetname": "Polycom XXXX Phone",
    "targetclass": "IPDevice",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{731AAAE6-F912-426d-98E9-FC527F7E80DD}",
    "sourcename": "LANEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "{ABB0C810-A9B9-49f0-AB02-5F76EE70A4ED}",
    "targetname": "Access Point",
    "targetclass": "IPDevice",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{731AAAE6-F912-426d-98E9-FC527F7E80DD}",
    "sourcename": "LANEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "{AC236FBA-1E17-4017-B97D-6485FEB3C50C}",
    "targetname": "IP Phone",
    "targetclass": "IPDevice",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  },
  {
    "source": "{731AAAE6-F912-426d-98E9-FC527F7E80DD}",
    "sourcename": "LANEnabled",
    "sourceclass": "ServiceConstraint",
    "target": "{7DD6D90F-6732-4709-88A3-BCAD6E375ACA}",
    "targetname": "LAN",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{2EF4E2F8-19DF-4307-84BB-2BFAC219EEFE}",
    "sourcename": "WifiProvider",
    "sourceclass": "ServiceConstraint",
    "target": "CFSWIFI",
    "targetname": "WiFi",
    "targetclass": "Customer Facing Service Specification",
    "value": "1",
    "type": "Dependency",
    "stereotype": ""
  },
  {
    "source": "{2EF4E2F8-19DF-4307-84BB-2BFAC219EEFE}",
    "sourcename": "WifiProvider",
    "sourceclass": "ServiceConstraint",
    "target": "RFSRUCKUS",
    "targetname": "Ruckus SmartZone Controller",
    "targetclass": "Resource Facing Service Specification",
    "value": "1",
    "type": "Association",
    "stereotype": ""
  }
]



// describe('Given a constraints engine', function() {
//   var constraintEngineExplicit
//   before(function(){
//      constraintEngineExplicit = constraints.compile(data,{explicit: false});
//   })
//   describe('When there are emergent constraints', function() {  
//     it.only('Then emergent nodes are consistent ', function() {
//       var result = constraintEngineExplicit.getConsistencyCheck("CFSWIFI","RFSRUCKUS");      
//       assert(result.consistent);
//     });
//   });
// })
