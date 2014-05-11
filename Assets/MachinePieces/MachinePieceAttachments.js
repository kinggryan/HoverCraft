#pragma strict

public var numberOfConnectedObjects : int;
public var connectedObjects : GameObject[];

function clearAttachments () {
	connectedObjects = new GameObject[numberOfConnectedObjects];
	for(var currObject : GameObject in connectedObjects)
	{
		currObject = null;
	}
}

function Awake () {
	clearAttachments();
}

function Update () {

}