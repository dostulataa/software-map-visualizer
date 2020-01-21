export default {
	"projectName": "Example Project 2",
	"apiVersion": "1.0",
	"nodes": [
		{
			"name": "root",
			"type": "Folder",
			"attributes": {},
			"children": [
                {
                    "name": "firstNode",
					"type": "File",
					"attributes": {
                        "rloc": 600
					},
                    "children": [],
					"link": "http://www.google.de"
                },
                {
                    "name": "secondNode",
					"type": "File",
					"attributes": {
                        "rloc": 400
					},
                    "children": [],
					"link": "http://www.google.de"
                },
                {
                    "name": "thirdNode",
                    "type": "File",
                    "attributes": {
                        "rloc": 200
                    },
                    "children": [],
                    "link": "http://www.google.de"
                },
                {
                    "name": "fourthNode",
                    "type": "Folder",
                    "attributes": {
                        "rloc": 600
                    },
                    "children": [
                        {
                            "name": "fourthNodesFirstChild",
                            "type": "File",
                            "attributes": {
                                "rloc": 200
                            },
                            "children": [],
                            "link": "http://www.google.de"
                        },

                        {
                            "name": "fourthNodesSecondChild",
                            "type": "Folder",
                            "attributes": {
                                "rloc": 300
                            },
                            "children": [
                                {
                                    "name": "file1",
                                    "type": "File",
                                    "attributes": {
                                        "rloc": 120
                                    },
                                    "children": [],
                                    "link": "http://www.google.de"
                                },
                                {
                                    "name": "file2",
                                    "type": "File",
                                    "attributes": {
                                        "rloc": 100
                                    },
                                    "children": [],
                                    "link": "http://www.google.de"
                                },
                                {
                                    "name": "file3",
                                    "type": "File",
                                    "attributes": {
                                        "rloc": 80
                                    },
                                    "children": [],
                                    "link": "http://www.google.de"
                                }
                            ],
                            "link": "http://www.google.de"
                        },
                        {
                            "name": "fourthNodeThirdChild",
                            "type": "File",
                            "attributes": {
                                "rloc": 100
                            },
                            "children": [],
                            "link": "http://www.google.de"
                        }
                    ],
                    "link": "http://www.google.de"
                },
                {
                    "name": "fifthNode",
                    "type": "File",
                    "attributes": {
                        "rloc": 200
                    },
                    "children": [],
                    "link": "http://www.google.de"
                },
                {
                    "name": "sixthNode",
					"type": "File",
					"attributes": {
						"rloc": 300
					},
                    "children": [],
					"link": "http://www.google.de"
                },
                {
					"name": "seventhNode",
					"type": "Folder",
					"attributes": {
						"rloc": 100
					},
                    "children": [
                        {
                            "name": "seventhNodesFirstChild",
                            "type": "File",
                            "attributes": {
                                "rloc": 60
                            },
                            "children": [],
                            "link": "http://www.google.de"
                        },
                        {
                            "name": "seventhNodesSecondChild",
                            "type": "File",
                            "attributes": {
                                "rloc": 40
                            },
                            "children": [],
                            "link": "http://www.google.de"
                        },

                    ],
					"link": "http://www.google.de"
				},
			]
		}
	],
	"edges": [],
	"attributeTypes": {}
}