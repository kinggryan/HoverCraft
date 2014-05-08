#pragma strict

function OnMouseDown() {
	var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	ccc.actionMode = 2;
	ccc.highlightColor = Color(1,.5,.5);
	for(var currRotate in GameObject.FindObjectsOfType(RotationGrabber))
		GameObject.Destroy(currRotate.gameObject);
		
	for(var currObject : GameObject in GameObject.FindGameObjectsWithTag("piecebutton"))
	{
	 	var colorText : GUIText = currObject.GetComponent("GUIText");
	 	colorText.color = Color(1,1,1);
	}
}