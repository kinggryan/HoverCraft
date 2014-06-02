#pragma strict

// HoverControllerClient class
// Component attaches to hoverplate on clients. Takes inputs and calls RPCs server side that indicate which hoverplate to move and how to move them

class HoverControllerClient extends MonoBehaviour {
	private var nView : NetworkView;
	
	function Update() {
		if(Input.GetKeyDown("w"))
			nView.RPC("pressForward",RPCMode.Server,Network.player);
		if(Input.GetKeyDown("s"))
			nView.RPC("pressBackward",RPCMode.Server,Network.player);
		if(Input.GetKeyDown("a"))
			nView.RPC("pressTurnLeft",RPCMode.Server,Network.player);
		if(Input.GetKeyDown("d"))
			nView.RPC("pressTurnRight",RPCMode.Server,Network.player);
		if(Input.GetKeyDown("q"))
			nView.RPC("pressStrafeLeft",RPCMode.Server,Network.player);
		if(Input.GetKeyDown("e"))
			nView.RPC("pressStrafeRight",RPCMode.Server,Network.player);
			
		if(Input.GetKeyUp("w"))
			nView.RPC("releaseForward",RPCMode.Server,Network.player);
		if(Input.GetKeyUp("s"))
			nView.RPC("releaseBackward",RPCMode.Server,Network.player);
		if(Input.GetKeyUp("a"))
			nView.RPC("releaseTurnLeft",RPCMode.Server,Network.player);
		if(Input.GetKeyUp("d"))
			nView.RPC("releaseTurnRight",RPCMode.Server,Network.player);
		if(Input.GetKeyUp("q"))
			nView.RPC("releaseStrafeLeft",RPCMode.Server,Network.player);
		if(Input.GetKeyUp("e"))
			nView.RPC("releaseStrafeRight",RPCMode.Server,Network.player);
			
		if(Input.GetKey("g"))
			networkView.RPC("RPCTest",RPCMode.Server);
	}
	
	function Start() {
		nView = networkView;
	}
	
	@RPC
	function pressForward(player : NetworkPlayer) {
	//	if(Network.player == player)
//			forward = true;
			Debug.Log("pressed2");
	}
}