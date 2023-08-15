# Example Content for Context payload

This folder provides example request and response payloads.

## Patient with Jurisdictional Health Number (JHN)

Expected to be our most commonly used context payload for patients,
whereby the (in BC) Personal Health Number.  In the example provided here, 
the identifier is qualified by the system OID, in this case the BC PHN.

## Patient with Medical Record Number

For Clinical Information Systems, they may only know the MRN for the patient.

## Patient by FHIR Server Resource Identifier

This is less likely, but feasible for launch to know the Patient by its FHIR Resource ID. In this case, the Resource Identifier is as known by the FHIR server that its Authorization Server is being connected to.

## The POST response providing context identifier.

```json
{
    "contextId": "ac5da954-9ef0-4897-97f6-c02f583717c9"
}
```

The calling EMR or system takes the returned contextId value and will then pass it as the value of the launch GET request parameter, following SMART on FHIR EHR Launch:

```code
launch=ac5da954-9ef0-4897-97f6-c02f583717c9
```
