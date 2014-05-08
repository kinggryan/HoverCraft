#pragma strict

public var piece : GameObject;

function Start () {

}

function Update () {

}

function OnMouseDown() {
	 var obj : GameObject = GameObject.Find("MainCreatorControl");
	 var cControl : CreatorControl = obj.GetComponent("CreatorControl");
	 cControl.machinePieceToCreate = piece;
	 cControl.actionMode = 0;
	 cControl.highlightColor = Color(.5,.5,1);
	 
	 for(var currObject : GameObject in GameObject.FindGameObjectsWithTag("piecebutton"))
	 {
	 	var colorText : GUIText = currObject.GetComponent("GUIText");
	 	colorText.color = Color(1,1,1);
	 }
	 
	 colorText = GetComponent("GUIText");
	 colorText.color = Color(.5,.5,1);
	 
	for(var currRotate in GameObject.FindObjectsOfType(RotationGrabber))
		GameObject.Destroy(currRotate.gameObject);
}