#pragma strict

static public var loadFlag : boolean = false;
static public var loadFileName : String;

function Start () {
	// Set up piece dictionary
	PieceDictionary.InitializeDictionary();
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
				
//			rootNode.SetData(PieceDictionary.GetIndexFromPieceType(AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/"+RemoveClone(piece.ToString()+".prefab"),GameObject)),piece.transform.position,piece.transform.rotation,PieceDictionary.GetIndexFromPieceType(activator),activatorKey);
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
	
	if(piece.transform.parent == null && connector.mainJoint == null)
		parentPosition = piece.transform.position;
	else if(connector.mainJoint == null)
		parentPosition = piece.transform.parent.position;
	else
		parentPosition = connector.mainJoint.connectedBody.transform.position;
	
	var activator : KeyBindedActivator = piece.GetComponent(KeyBindedActivator);
	var activatorKey : char;
	var activatorString : String;
	if(activator != null)
	{
		Debug.Log("Setting activator to : "+activator);
		activatorString = FixActivatorName(activator.ToString());
		activatorKey = activator.key[0];
		Debug.Log("Index in piece dictionary for this activator : "+PieceDictionary.GetIndexFromPieceType(activator));
	}
	else
	{
		activatorString = null;
		activatorKey = 0;
	}
				
//	Debug.Log("Pretest: " + AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/"+RemoveClone(piece.ToString())+".prefab",GameObject));
//	Debug.Log("Test : " +PieceDictionary.GetIndexFromPieceType(AssetDatabase.LoadAssetAtPath("Assets/RobotPieces/"+RemoveClone(piece.ToString())+".prefab",GameObject)));
	node.SetData(PieceDictionary.GetIndexFromPieceType(Resources.Load(RemoveClone(piece.ToString()),GameObject)),piece.transform.position - parentPosition,piece.transform.rotation,PieceDictionary.GetIndexFromPieceType(activatorString),activatorKey);
	
	// add children nodes
	var machinePieces : MachinePieceAttachments = piece.GetComponent(MachinePieceAttachments);
	for(childPiece in machinePieces.connectedObjects)
	{
		if(childPiece != null && (piece.transform.parent == null || childPiece.gameObject != piece.transform.parent.gameObject)
							  && (connector.mainJoint == null || childPiece.rigidbody != connector.mainJoint.connectedBody))
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
	ccc.rootPiece = rootNode.ConstructSelfAndChildren(null,Vector3.zero);
	for(currPiece in GameObject.FindGameObjectsWithTag("piece")){
		if(currPiece.rigidbody != null) {
			currPiece.rigidbody.freezeRotation = true;
			currPiece.rigidbody.detectCollisions = false;
		}
	}
	Debug.Log("Construction Complete");
}

// Constructs a machine from Tree and returns the rootPiece
static function BuildMachineFromTreeForMultiplayer(rootNode : PieceTreeNode, offset : Vector3) {
	return (rootNode.ConstructSelfAndChildren(null, offset));
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

static function FixActivatorName(string : String) : String {
	var charArray : String = "(";
	var endChar : String = ")";
	// get string between final two parens
	Debug.Log("Fixing : "+ string + " length of " + string.length + ", with last ( at : "+string.LastIndexOf("(")+ " and " +string.LastIndexOf(")"));
	return string.Substring(string.LastIndexOf("(")+1,string.LastIndexOf(")")-string.LastIndexOf("(")-1);
}

static function SaveMachineDesign(fileName : String) {
	Debug.Log("Saving Machine Design...");
	var rootNode = ConstructTreeFromGame();
	SaveLoad.SaveMachineDesign("MachineDesigns/"+fileName,rootNode);
}

static function LoadMachineDesign(fileName : String) {
	var data = SaveLoad.LoadMachineDesign("MachineDesigns/"+fileName);
	BuildMachineFromTree(data.rootNode);
}

// build two machines at given offsets and set their control schemes
static function LoadMachineDesignsForTwoPlayers(p1Design : String, p2Design : String, p1StartPosition : Vector3, p2StartPosition : Vector3) {
	var p1Data = SaveLoad.LoadMachineDesign(Application.dataPath+"/MachineDesigns/"+p1Design);
	var p1Root = BuildMachineFromTreeForMultiplayer(p1Data.rootNode,p1StartPosition);
	
	Debug.Log("Player 1 built");
	
	var p2Data = SaveLoad.LoadMachineDesign(Application.dataPath+"/MachineDesigns/"+p2Design);
	var p2Root = BuildMachineFromTreeForMultiplayer(p2Data.rootNode,p2StartPosition);
	
	Debug.Log("Player 2 built");
	
	//destroy static camera and add split screen cameras
	var camera1 : Camera = Instantiate(GameObject.Find("Main Camera"),Vector3.zero,Quaternion.identity).GetComponent("Camera");
	var camera2 : Camera = Instantiate(GameObject.Find("Main Camera"),Vector3.zero,Quaternion.identity).GetComponent("Camera");
	GameObject.Destroy(GameObject.Find("Main Camera"), 0);

	var height = camera1.pixelHeight/2;
	var width = camera1.pixelWidth;
	
	camera1.pixelRect = Rect(0,0,width,height);
	camera2.pixelRect = Rect(0,height,width,height);

	var follower : CameraRobotFollower = camera1.gameObject.AddComponent("CameraRobotFollower");
	follower.objToFollow = p1Root;
	var connector : Connector = p1Root.GetComponent("Connector");
	var p1Controller : MotionController = connector.AddMotionController();
	
	follower = camera2.gameObject.AddComponent("CameraRobotFollower");
	follower.objToFollow = p2Root;
	connector = p2Root.GetComponent("Connector");
	var p2Controller : MotionController = connector.AddMotionController();
	
	// set Player 2 controls
	p2Controller.kForward = "i";
	p2Controller.kBackward = "k";
	p2Controller.kTurnLeft = "j";
	p2Controller.kTurnRight = "l";
	p2Controller.kStrafeRight = "o";
	p2Controller.kStrafeLeft = "u";
}