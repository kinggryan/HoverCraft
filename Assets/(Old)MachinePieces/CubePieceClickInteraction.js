#pragma strict

function Start () {

}

function Update () {

}

function OnMouseDown() {

	var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	collider.Raycast(ray,hit,100);
	
	// intersect with box and find local coords
	var clickPoint : Vector3 = collider.ClosestPointOnBounds(hit.point);
	clickPoint = transform.InverseTransformPoint(clickPoint);
	
	var side : Vector3;
	var mBCollider : BoxCollider = collider;
	var index : int;
	
	if(Mathf.Approximately(clickPoint.x, (mBCollider.size.x)/2))
	{
		side = Vector3.right;
		index = 0;
	}
	else if(Mathf.Approximately(clickPoint.x, -(mBCollider.size.x)/2))
	{
		side = Vector3.left;
		index = 1;
	}
	else if(Mathf.Approximately(clickPoint.y, (mBCollider.size.y)/2))
	{
		side = Vector3.up;
		index = 2;
	}
	else if(Mathf.Approximately(clickPoint.y, -(mBCollider.size.y)/2))
	{
		side = Vector3.down;
		index = 3;
	}
	else if(Mathf.Approximately(clickPoint.z, (mBCollider.size.z)/2))
	{
		side = Vector3.forward;
		index = 4;
	}
	else if(Mathf.Approximately(clickPoint.z, -(mBCollider.size.z)/2))
	{
		side = Vector3.back;
		index = 5;
	}
		 
	var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	ccc.AddPieceToBlock(gameObject,.5*side,side,index);

}