const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/context.js'];

const doc = {
    info: {
        version: "1.0.0",
        title: "SMART on FHIR Context API",
        description: "This is a REST API for managing SMART on FHIR Contexts",
    },
    host: "localhost:3000",
    basePath: "/api/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: {
        "/context/{id}": {
            get: {
                "tags": [
                    "Context"
                ],
                "summary": "Get a context",
                "description": "Get a context by id",
                "operationId": "getContext",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "The context id",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The context",
                        "schema": {
                            "$ref": "#/definitions/Context"
                        }
                    },
                    "404": {
                        "description": "Context not found"
                    }
                }
            },
            delete: {
                "tags": [
                    "Context"
                ],
                "summary": "Delete a context",
                "description": "Delete a context by id",
                "operationId": "deleteContext",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "The context id",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Context deleted"
                    },
                    "404": {
                        "description": "Context not found"
                    }
                }
            }
        },
        "/context": {
            post: {
                summary: "Create a context",
                "description": "Create a context",
                "operationId": "createContext",
                "parameters": [
                    {
                        name: "Context",
                        in: "body",
                        description: "The context to create",
                        "required": true,
                        schema: {
                            $ref: "#/definitions/Context"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Context created",
                        "schema": {
                            "$ref": "#/definitions/ContextId"
                        }
                    }
                }
            }
        }
    },
    definitions: {
        ContextId: {
            type: "object",
            required: [
                "contextId"
            ],
            properties: {
                contextId: {
                    type: "string",
                    description: "The context id"
                }
            },
            example: {
                contextId: "3335a882-bf12-48bb-ad78-212a46ae9297"
            }
        },
        Context: {
            type: "object",
            required: 
            [
                "resourceType"
            ],
            properties: {
                resourceType: {
                    type: "string",
                    description: "The resource type of the context",
                    value: "Parameters"
                },
            },
            example: {
                resourceType: "Parameters",
                parameter: [
                    {
                        name: "patient",
                        resource: [
                            {
                                resourceType: "Patient",
                                use: "official",
                                system: "urn:oid:2.16.840.1.113883.4.50",
                                type: "MR",
                                value: "12345"
                            }
                        ]
                    }
                ]
            }
        },
        parameter: {
            type: "array",
            items: {
                type: "object",
                required: [
                    "name",
                    "resource"
                ],
                properties: {
                    name: {
                        type: "string",
                        description: "The name of the context parameter"
                    },
                    resource: {
                        type: "array",
                        description: "The resource of the context parameter",
                        items: {
                            type: "object",
                            properties: {
                                resourceType: {
                                    type: "string",
                                    description: "The name of the context parameter part"
                                },
                                use: {
                                    type: "string",
                                    description: "The use of the context parameter part"
                                },
                                system: {
                                    type: "string",
                                    description: "The identifier system of the patient identifier"
                                },
                                type: {
                                    type: "string",
                                    description: "The type of the patient identifier"
                                },
                                value: {
                                    type: "string",
                                    description: "The value of the patient identifier"
                                },
                            },
                            example: {
                                resourceType: "Patient",
                                use: "official",
                                system: "urn:oid:2.16.840.1.113883.4.50",
                                type: "MR",
                                value: "12345"
                            }
                        }
                    }
                },
                example: {
                    name: "patient",
                    resource: [
                        {
                            resourceType: "Patient",
                            use: "usual",
                            system: "urn:oid:2.16.840.1.113883.4.50",
                            type: "JHN",
                            value: "9094888634"
                        }
                    ]
                }
            }
        }
    },
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    //require('./index.js')
})