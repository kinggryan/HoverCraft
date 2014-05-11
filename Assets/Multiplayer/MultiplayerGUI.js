#pragma strict

// Multiplayer Menu.
// Loads two designs

public var p1StartPosition : Vector3;
public var p2StartPosition : Vector3;
private var loadFileName1 : String = "MyDesign";
private var loadFileName2 : String = "MyDesign";

function OnGUI() {
	loadFileName1 = GUI.TextField(Rect(25,85,150,25),loadFileName1,25);
	if(GUI.Button(Rect(25,25,150,50),"Player 1 Design")) {
		// do nothing
	}
	
	loadFileName2 = GUI.TextField(Rect(200,85,150,25),loadFileName2,25);
	if(GUI.Button(Rect(200,25,150,50),"Player 2 Design")) {
		// do nothing
	}
	
	if(GUI.Button(Rect(375, 25, 150, 50),"Start!")) {
		BeginGame(loadFileName1,loadFileName2);
	}
}

function FixName(string : String) {
	var charArray : String = "(";
	return string.Substring(0, string.IndexOfAny(charArray.ToCharArray()));
}

function BeginGame(p1MachineDesign : String, p2MachineDesign : String) {
	MachineDesignManager.LoadMachineDesignsForTwoPlayers(p1MachineDesign,p2MachineDesign,p1StartPosition,p2StartPosition);
	Physics.gravity = Vector3(0,-9.8,0);

	// activate all pieces and remove mouse-over highlights
	for(piece in GameObject.FindGameObjectsWithTag("piece")) {
		if(piece.rigidbody != null)
		{
			piece.GetComponent(Rigidbody).freezeRotation = false;
			piece.GetComponent(Rigidbody).detectCollisions = true;
		}
		Destroy(piece.GetComponent("MouseOverHighlight"));
	}
	
	Destroy(this);
}