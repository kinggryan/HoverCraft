#pragma strict

public var testObj : GameObject;
static public var loadFlag : boolean = false;
static public var loadFileName : String;

function Start () {
	// Set up piece dictionary
	PieceDictionary.InitializeDictionary();
	//Debug.Log(AssetDatabase.GetAssetPath(testObj));
	
	if(loadFlag)
		LoadMachineDesign(loadFileName);
	
	loadFlag = false;
}

static function ConstructTreeFromGame()
{
	// set node count to 0
	PieceTreeNode.nodeCount = 0;

	// we will store the nodes here as we create them.
	var tempNodeList = new Array();
	
	// find root node and start building tree, depth first
	var rootNode = new PieceTreeNode();
	
	for(piece in GameObject.FindGameObjectsWithTag("piece"))
	{
		var connector : Connector = piece.GetComponent(Connector);
		if(connector.mainJoint == null || connector.mainJoint.connectedBody == null)
		{
			var activator : KeyBindedActivator = piece.GetComponent(KeyBindedActivator);
			var activatorKey : char;
			var activatorString : String;
			if(activator != null)
			{
				activatorString = RemoveClone(activator.ToString());
				activatorKey = activator.key[0];
			}
			else
			{
				activatorString = null;
				activatorKey = 0;
			}
				
			rootNode.SetData(PieceDictionary.GetIndexFromPieceType(AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/"+RemoveClone(piece.ToString()+".prefab"),GameObject)),piece.transform.position,piece.transform.rotation,PieceDictionary.GetIndexFromPieceType(activator),activatorKey);
			Debug.Log("Root Piece : " + piece);
			BuildTreeRecursive(piece,rootNode);
			
			break;
			
		}
	}
	
	return rootNode;
	// and save it
//	Debug.Log("Saving...");
//	SaveLoad.SaveMachineDesign(rootNode);
}

// builds a node for a given piece and calls build function for its children
static function BuildTreeRecursive(piece : GameObject, node : PieceTreeNode)
{
	var connector : Connector = piece.GetComponent(Connector);
	var parentPosition : Vector3;
	
	if(connector.mainJoint == null)
		parentPosition = Vector3.zero;
	else
		parentPosition = connector.mainJoint.connectedBody.transform.position;
	
	var activator : KeyBindedActivator = piece.GetComponent(KeyBindedActivator);
	var activatorKey : char;
	var activatorString : String;
	if(activator != null)
	{
		activatorString = RemoveClone(activator.ToString());
		activatorKey = activator.key[0];
	}
	else
	{
		activatorString = null;
		activatorKey = 0;
	}
		
//	Debug.Log("Pretest: " + AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/"+RemoveClone(piece.ToString())+".prefab",GameObject));
//	Debug.Log("Test : " +PieceDictionary.GetIndexFromPieceType(AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/"+RemoveClone(piece.ToString())+".prefab",GameObject)));
	node.SetData(PieceDictionary.GetIndexFromPieceType(AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/"+RemoveClone(piece.ToString())+".prefab",GameObject)),piece.transform.position,piece.transform.rotation,PieceDictionary.GetIndexFromPieceType(activator),activatorKey);
	
	// add children nodes
	var machinePieces : MachinePieceAttachments = piece.GetComponent(MachinePieceAttachments);
	for(childPiece in machinePieces.connectedObjects)
	{
		if(childPiece != null && (connector.mainJoint == null || childPiece != connector.mainJoint.connectedBody.gameObject))
		{
			var childNode = new PieceTreeNode();

			node.AddChild(childNode);
			
			Debug.Log("Adding child : " + childPiece + " to parent : " + piece);
			
			BuildTreeRecursive(childPiece,childNode);
		}
	}
}

// deletes all machine pieces
static function ClearAllPieces() {
	for(piece in GameObject.FindGameObjectsWithTag("piece"))
		GameObject.Destroy(piece,0);
}

// Constructs a machine from Tree
static function BuildMachineFromTree(rootNode : PieceTreeNode){
	ClearAllPieces();
	Debug.Log("Pieces cleared");
	var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	Debug.Log("Root node : "+rootNode + " and piece type : "+rootNode.pieceType);
	ccc.rootPiece = rootNode.ConstructSelfAndChildren(null);
	for(currPiece in GameObject.FindGameObjectsWithTag("piece")){
		currPiece.rigidbody.freezeRotation = true;
		currPiece.rigidbody.detectCollisions = false;
	}
	Debug.Log("Construction Complete");
}

static function TestSave()
{
	Debug.Log("Test Saving");
	SaveLoad.Save();
}

static function TestLoad()
{
	Debug.Log("Loading Machine Design...");
	var data : MachineDesignSaveData = SaveLoad.LoadMachineDesign();
	Debug.Log("Loading Complete");
	
	Debug.Log("Beginning Construction...");
	BuildMachineFromTree(data.rootNode);
}

static function RemoveClone(string : String) : String {
	var charArray : String = "( ";
	return string.Substring(0, string.IndexOfAny(charArray.ToCharArray()));
}

static function SaveMachineDesign(fileName : String) {
	var rootNode = ConstructTreeFromGame();
	SaveLoad.SaveMachineDesign(Application.dataPath+"/MachineDesigns/"+fileName,rootNode);
}

static function LoadMachineDesign(fileName : String) {
	var data = SaveLoad.LoadMachineDesign(Application.dataPath+"/MachineDesigns/"+fileName);
	BuildMachineFromTree(data.rootNode);
}