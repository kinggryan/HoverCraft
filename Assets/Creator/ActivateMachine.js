#pragma strict

function OnMouseDown() {
	for(var currRotate in GameObject.FindObjectsOfType(RotationGrabber))
		GameObject.Destroy(currRotate.gameObject);

	for(var currObject : GameObject in GameObject.FindGameObjectsWithTag("piece"))
	{
		if(currObject != null)
		{
			var connector : Connector = currObject.GetComponent("Connector");
			if(connector != null  && connector.GetLinkedPieceCount() == 0)
				connector.Activate();
		}
	}

	for(var currObject : GameObject in GameObject.FindGameObjectsWithTag("piecebutton"))
	 {
	 	var colorText : GUIText = currObject.GetComponent("GUIText");
	 	colorText.color = Color(1,1,1);
	 }
}