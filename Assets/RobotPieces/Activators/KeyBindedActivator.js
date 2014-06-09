#pragma strict

class KeyBindedActivator extends Activator {

	function Start()
	{
		attachedPiece = GetComponent(Connector);
		relatedCamera = GameObject.Find("Main Camera");
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
			attachedPiece.FixedActivate();
		}
	}
}