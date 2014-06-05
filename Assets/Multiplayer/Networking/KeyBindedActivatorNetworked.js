#pragma strict

// Key Binded Activator Networked class. 
//  Attaches to a piece and sends player input data to the server.

class KeyBindedActivatorNetworked extends MonoBehaviour {
	public var key : String;
	public var attachedPiece : Connector;
	public var relatedCamera : GameObject;
	public var controlledByMe : boolean = false;
	
	private var keyPressed : boolean = false;
	
	function Start() {
		if(Network.isServer) {
			attachedPiece = GetComponent(Connector);
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
	
	function FixedUpdate() {
		if(Network.isServer && keyPressed) {
			attachedPiece.FixedActivateNetworked();
		}
	}
}