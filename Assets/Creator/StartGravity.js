#pragma strict

public var gravityValue : Vector3;

function OnMouseDown() {
	Physics.gravity = Vector3(0,-9.8,0);
	Debug.Log("Gravity on");

	var getController : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	getController.actionMode = 1;
		
	for(var currRotate in GameObject.FindObjectsOfType(RotationGrabber))
		GameObject.Destroy(currRotate.gameObject);
	
	// activate rotation and collision for all pieces
	for(var currObject in GameObject.FindGameObjectsWithTag("piece"))
	{
		if(currObject.rigidbody != null)
		{
			currObject.GetComponent(Rigidbody).freezeRotation = false;
			currObject.GetComponent(Rigidbody).detectCollisions = true;
		}
		else
			Debug.Log("No rigidbody on object " + currObject);
	}
	
	getController.SwitchToPlayMode();
//	GameObject.Find("Main Camera").GetComponent(CameraMover).Destroy(GameObject.Find("Main Camera").GetComponent(CameraMover),0);
//	GameObject.Find("Main Camera").transform.position = Vector3(0,8,-12);
/*	GameObject.Find("Main Camera").transform.rotation = Quaternion.LookRotation( GameObject.Find("WheelAxis").transform.position - GameObject.Find("Main Camera").transform.position,Vector3.up);
	GameObject.Find("Main Camera").transform.parent = GameObject.Find("WheelAxis").transform; */
/*	var follower : CameraRobotFollower = GameObject.Find("Main Camera").AddComponent("CameraRobotFollower");
	follower.objToFollow = GameObject.Find("WheelAxis2");
	var tempAxis : WheelAxisMotionControl2 = GameObject.Find("WheelAxis2").AddComponent("WheelAxisMotionControl2");
	tempAxis.wheelAxis = GameObject.Find("WheelAxis2").GetComponent("WheelAxisConnector2");  */
//	follower.objToFollow = GameObject.Find("HoverPlate");
//	GameObject.Find("HoverPlate").AddComponent("HoverPlateMotionController");
//	follower.objToFollow = GameObject.Find("TreadPlate");
//	GameObject.Find("TreadPlate").AddComponent("TreadPlateMotionController");
}