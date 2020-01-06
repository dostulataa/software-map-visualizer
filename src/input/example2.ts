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
					"link": "http://www.google.de"
                },
                {
                    "name": "secondNode",
					"type": "File",
					"attributes": {
                        "rloc": 400
					},
					"link": "http://www.google.de"
                },
                {
                    "name": "thirdNode",
                    "type": "File",
                    "attributes": {
                        "rloc": 200
                    },
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
                                    "name": "extraChild1",
                                    "type": "File",
                                    "attributes": {
                                        "rloc": 100
                                    },
                                    "link": "http://www.google.de"
                                },
                                {
                                    "name": "extraChild2",
                                    "type": "Folder",
                                    "attributes": {
                                        "rloc": 140
                                    },
                                    "children": [
                                        {
                                            "name": "extraextraChild1",
                                            "type": "File",
                                            "attributes": {
                                                "rloc": 80
                                            },
                                            "link": "http://www.google.de"
                                        },
                                        {
                                            "name": "extraextraChild2",
                                            "type": "Folder",
                                            "attributes": {
                                                "rloc": 40
                                            },
                                            "children": [
                                                {
                                                    "name": "extraextraChild1",
                                                    "type": "File",
                                                    "attributes": {
                                                        "rloc": 20
                                                    },
                                                    "link": "http://www.google.de"
                                                },
                                                {
                                                    "name": "extraextraChild1",
                                                    "type": "File",
                                                    "attributes": {
                                                        "rloc": 10
                                                    },
                                                    "link": "http://www.google.de"
                                                },
                                                {
                                                    "name": "extraextraChild1",
                                                    "type": "File",
                                                    "attributes": {
                                                        "rloc": 10
                                                    },
                                                    "link": "http://www.google.de"
                                                },
                                            ],
                                            "link": "http://www.google.de"
                                        },
                                        {
                                            "name": "extraextraChild3",
                                            "type": "File",
                                            "attributes": {
                                                "rloc": 20
                                            },
                                            "link": "http://www.google.de"
                                        },
                                    ],
                                    "link": "http://www.google.de"
                                },
                                {
                                    "name": "extraChild3",
                                    "type": "File",
                                    "attributes": {
                                        "rloc": 60
                                    },
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
                    "link": "http://www.google.de"
                },
                {
                    "name": "sixthNode",
					"type": "File",
					"attributes": {
						"rloc": 300
					},
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
                            "link": "http://www.google.de"
                        },
                        {
                            "name": "seventhNodesSecondChild",
                            "type": "File",
                            "attributes": {
                                "rloc": 40
                            },
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