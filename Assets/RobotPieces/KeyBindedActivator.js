#pragma strict

public var key : String;
public var attachedPiece : Connector;

function Start()
{
	attachedPiece = GetComponent(Connector);
}

function Update()
{
	if(Input.GetKeyDown(key))
		attachedPiece.Activate();
	if(Input.GetKeyUp(key))
		attachedPiece.DeActivate();
}

function FixedUpdate()
{
	if(Input.GetKey(key))
	{
		Debug.Log("Calling activation");
		attachedPiece.FixedActivate();
	}
}