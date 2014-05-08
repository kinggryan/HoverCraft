#pragma strict

public var connectedPieceTypes : GameObject[];
public var connectedPieceLocations : Vector3[];

function Start()
{
	for(var i = 0 ; i < connectedPieceTypes.length ; i++)
	{
		var currObj = connectedPieceTypes[i];
		var newObjConnector : Connector = GameObject.Instantiate(currObj, connectedPieceLocations[i], Quaternion.identity).GetComponent("Connector");
		newObjConnector.Connect(gameObject,connectedPieceLocations[i],Vector3.forward);
	}
}