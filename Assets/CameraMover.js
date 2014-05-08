#pragma strict

function Start () {
	transform.position = transform.position + Vector3(0,10,0);
//	transform.rotation.SetLookRotation(Vector3(0,1,-.5));
}

function Update () {
	var hMove = Input.GetAxis("Horizontal");
	var	vMove = Input.GetAxis("Vertical") * .35;
	
	if(Input.GetKey("q"))
		transform.RotateAround(Vector3.zero, transform.TransformDirection(Vector3.right), -.5);
	if(Input.GetKey("e"))
		transform.RotateAround(Vector3.zero, transform.TransformDirection(Vector3.right), .5);
		
	transform.RotateAround (Vector3.zero, Vector3.up, hMove);
	transform.position = transform.position + vMove*transform.TransformDirection(Vector3.forward);
}