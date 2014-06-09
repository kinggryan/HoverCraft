#pragma strict

class TargettingActivator extends Activator {

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
		if(Input.GetKeyDown(key))
		{
			relatedCamera.Destroy(relatedCamera.GetComponent("CameraRobotFollower"));
			relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
			var TC : TargettingCamera = relatedCamera.AddComponent("TargettingCamera");
			TC.objToFollow = GetComponent("Connector");
		}
	}
}