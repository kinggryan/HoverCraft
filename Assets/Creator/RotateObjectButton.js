#pragma strict

function OnMouseDown() {
	var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	ccc.actionMode = 3;
	ccc.highlightColor = Color(.5,1,.5);
	
	for(var currObject : GameObject in GameObject.FindGameObjectsWithTag("piecebutton"))
	{
	 	var colorText : GUIText = currObject.GetComponent("GUIText");
	 	colorText.color = Color(1,1,1);
	}
}