#pragma strict

class TargettingActivator extends Activator {

	var selected : boolean = false;
	var mainCamFollowPiece : GameObject;

	function Start()
	{
		attachedPiece = GetComponent(Connector);
		relatedCamera = GameObject.Find("Main Camera");
	}

/*	function Update()
	{
		if(Input.GetKeyDown(key))
			attachedPiece.Activate();
		if(Input.GetKeyUp(key))
			attachedPiece.DeActivate();
	} */

	function Update()
	{
		if(Input.GetKeyDown(key))
		{
			if(!selected) {
				var CRF : CameraRobotFollower = relatedCamera.GetComponent("CameraRobotFollower");
				Debug.Log(CRF);
				mainCamFollowPiece = CRF.objToFollow;
				relatedCamera.Destroy(CRF);
				relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
				var TC : TargettingCamera = relatedCamera.AddComponent("TargettingCamera");
				TC.objToFollow = GetComponent("Connector");
				selected = true;
			}
			else {
				relatedCamera.Destroy(relatedCamera.GetComponent("CameraRobotFollower"));
				relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
				var camFollower : CameraRobotFollower = relatedCamera.AddComponent("CameraRobotFollower");
				camFollower.objToFollow = mainCamFollowPiece;
				selected = false;
			}
		}
	}
}