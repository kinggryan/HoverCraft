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

function OnCollisionEnter (collision : Collision) {
	var getController : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	if(getController.actionMode == 0)
	{
		for(var checkObj : GameObject in connectedObjects)
		{
	//		if(checkObj != null && checkObj != collision.gameObject)
//				Debug.Log("Block Added in contact with unconnected block");
		}
	}
}