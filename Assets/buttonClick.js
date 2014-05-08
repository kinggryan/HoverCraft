#pragma strict

public var objectToCreate : GameObject;

function Start () {

}

function Update () {
	if(Input.GetMouseButtonDown(0) && guiText.HitTest(Vector3(Input.mousePosition.x,Input.mousePosition.y,0)))
	{
		var connected : GameObject = GameObject.Find("Cube");
		var otherBody : Rigidbody = connected.rigidbody;
		
		connected.transform.position += Vector3(0,.5,0);
	
		var obj : GameObject = Instantiate(objectToCreate, otherBody.transform.position + Vector3(1,0,0), Quaternion.identity);
		
		obj.transform.rotation = Quaternion.LookRotation(Vector3.forward,Vector3.right);
		obj.GetComponent(ConfigurableJoint).connectedBody = otherBody;
		
		obj = Instantiate(objectToCreate, otherBody.transform.position + Vector3(-1,0,0), Quaternion.identity);
		obj.transform.rotation = Quaternion.LookRotation(Vector3.forward,Vector3.right);
		obj.GetComponent(ConfigurableJoint).connectedBody = otherBody;
//		obj.GetComponent(ConfigurableJoint).targetAngularVelocity = Vector3(-1,0,0);
		otherBody.mass = 1;
		
		obj = Instantiate(GameObject.Find("Cube"), otherBody.transform.position + Vector3(0,0,2), Quaternion.identity);
		var mJoint : HingeJoint = obj.AddComponent("HingeJoint");
		mJoint.anchor = Vector3(0,0,1);
		mJoint.connectedBody = otherBody;
		obj.rigidbody.mass = 1;
			
		otherBody = obj.rigidbody;
		obj = Instantiate(objectToCreate, otherBody.transform.position + Vector3(1,0,0), Quaternion.identity);
		
		obj.transform.rotation = Quaternion.LookRotation(Vector3.forward,Vector3.right);
		obj.GetComponent(ConfigurableJoint).connectedBody = otherBody;
		
		obj = Instantiate(objectToCreate, otherBody.transform.position + Vector3(-1,0,0), Quaternion.identity);
		obj.transform.rotation = Quaternion.LookRotation(Vector3.forward,Vector3.right);
		obj.GetComponent(ConfigurableJoint).connectedBody = otherBody;
//		obj.GetComponent(ConfigurableJoint).targetAngularVelocity = Vector3(-1,0,0);
		otherBody.mass = 1;
	}
}