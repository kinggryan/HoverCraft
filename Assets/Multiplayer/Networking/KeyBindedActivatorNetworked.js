#pragma strict

// Key Binded Activator Networked class. 
//  Attaches to a piece and sends player input data to the server.

class KeyBindedActivatorNetworked extends Activator {
	public var controlledByMe : boolean = false;
	
	private var keyPressed : boolean = false;
	
	function Start() {
		if(Network.isServer) {
			attachedPiece = GetComponent(Connector);
			
			// Assign controlling player
			var pData = GetComponentInParent(PlayerData) as PlayerData;
			if(pData != null)
				networkView.RPC("SetController",RPCMode.All,pData.player);
		}
		else {
			GameObject.Find("Main Camera");
		}
	}
	
	function Update()
	{
		if(controlledByMe) {
			if(Input.GetKeyDown(key))
				networkView.RPC("CallActivate",RPCMode.Server);
			if(Input.GetKeyUp(key))
				networkView.RPC("CallDeActivate",RPCMode.Server);
		}
	}
	
	/* 
	
		Server-side Functions 
		
		*/
	
	function FixedUpdate() {
		if(Network.isServer && keyPressed) {
			attachedPiece.FixedActivateNetworked();
		}
	}
	
	/*
		
		Client-side Functions
		
		*/
	@RPC
	function CallActivate() {
		attachedPiece.ActivateNetworked();
		keyPressed = true;
	}
	
	@RPC
	function CallDeActivate() {
		attachedPiece.DeActivateNetworked();
		keyPressed = false;
	}
	
	@RPC
	function SetController(player : NetworkPlayer) {
		if(Network.player == player) {
			controlledByMe = true;
		}
	}
}