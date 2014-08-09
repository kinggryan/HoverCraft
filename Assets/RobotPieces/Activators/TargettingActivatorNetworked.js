#pragma strict

class TargettingActivatorNetworked extends Activator {

	public var controlledByMe : boolean = false;
	
	private var keyPressed : boolean = false;
	
	var selected : boolean = false;
	var mainCamFollowPiece : GameObject;
	
	function Start() {
		if(Network.isServer) {
			attachedPiece = GetComponent(Connector);
			controlledByMe = false;
			
			// Assign controlling player
			var pData = GetComponentInParent(PlayerData) as PlayerData;
			if(pData != null)
				networkView.RPC("SetController",RPCMode.All,pData.player);
		}
		else {
			mainCamFollowPiece = GameObject.Find("Main Camera");
		}
		
		Debug.LogError("Being created");
	}
	
	function Update()
	{
		if(controlledByMe) {
			if(Input.GetKeyDown(key)) {
				// allocate the view here, then send to server. This way we write data, rather than reading it
				var nView = Network.AllocateViewID();
				networkView.RPC("CallActivate",RPCMode.Server,nView);
			}
		}
	}
	
	/* ********************
	
		Server-side Functions 
		
		*********************/
	
	function FixedUpdate() {
		if(Network.isServer && keyPressed) {
			attachedPiece.FixedActivateNetworked();
		}
	}
	
	@RPC
	function CallActivate(viewID : NetworkViewID, info : NetworkMessageInfo) {
		if(!selected) {
	/*		var CRF : CameraRobotFollower = relatedCamera.GetComponent("CameraRobotFollower");
			Debug.Log(CRF);
			mainCamFollowPiece = CRF.objToFollow;
			relatedCamera.Destroy(CRF);
			relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
			var TC : TargettingCamera = relatedCamera.AddComponent("TargettingCamera");
			TC.objToFollow = GetComponent("Connector"); */
			
			selected = true;
			networkView.RPC("AddOrDestroyTargetter",RPCMode.All,true,viewID,info.sender);
		}
		else {
		/*	relatedCamera.Destroy(relatedCamera.GetComponent("CameraRobotFollower"));
			relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
			var camFollower : CameraRobotFollower = relatedCamera.AddComponent("CameraRobotFollower");
			camFollower.objToFollow = mainCamFollowPiece; */
			selected = false;
			networkView.RPC("AddOrDestroyTargetter",RPCMode.All,false, Network.AllocateViewID(), info.sender);
		}
	}
	
	/****************
		
		Client-side Functions
		
		*****************/
	
	@RPC
	function AddOrDestroyTargetter(addTargetter : boolean, viewID : NetworkViewID, player: NetworkPlayer) {
		if(Network.player == player || Network.isServer) {
			if(addTargetter) { // add targetter component
				var targetter = gameObject.AddComponent(TargetterNetworked);
				var nView : NetworkView = gameObject.AddComponent(NetworkView);
				nView.viewID = viewID;
				nView.observed = targetter;
				nView.stateSynchronization = NetworkStateSynchronization.ReliableDeltaCompressed;
			
				// change camera methods
				if(Network.isClient && controlledByMe) {
					gameObject.Destroy(mainCamFollowPiece.GetComponent(CameraRobotFollower));
					var cam : TargettingCameraNetwork = mainCamFollowPiece.AddComponent(TargettingCameraNetwork);
					cam.objToFollow = transform;	
				}
			}
			else {	// destroy targetter component
				var machPieces = GetComponent(MachinePieceAttachments) as MachinePieceAttachments;
				var chasis = machPieces.connectedObjects[0];
		
				gameObject.Destroy(gameObject.GetComponent(TargetterNetworked));
				gameObject.Destroy(mainCamFollowPiece.GetComponent(TargettingCameraNetwork));
				var cam2 = mainCamFollowPiece.AddComponent(CameraRobotFollower) as CameraRobotFollower;
				cam2.objToFollow = chasis;	
				// TODO destroy new network view
			}
		}
	}
	
	@RPC
	function SetController(player : NetworkPlayer) {
		if(Network.player == player) {
			Debug.LogError("controller set to me");
			controlledByMe = true;
			relatedCamera = GameObject.Find("Main Camera");
		}
		else
			Debug.LogError("controller not me");
	}
}