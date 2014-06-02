#pragma strict

class HoverControllerServer extends MonoBehaviour {
	private var forward 	: boolean = false;
	private var backward 	: boolean = false;
	private var turnLeft 	: boolean = false;
	private var turnRight 	: boolean = false;
	private var strafeLeft 	: boolean = false;
	private var strafeRight	: boolean = false;
	
	@RPC
	function pressForward(player : NetworkPlayer) {
	//	if(Network.player == player)
			forward = true;
			Debug.Log("pressed");
	}
	
	@RPC
	function pressBackward(player : NetworkPlayer) {
	//	if(Network.player == player)
			backward = true;
	}
	
	@RPC
	function pressTurnLeft(player : NetworkPlayer) {
	//	if(Network.player == player)
			turnLeft = true;
	}
	
	@RPC
	function pressTurnRight(player : NetworkPlayer) {
	//	if(Network.player == player)
			turnRight = true;
	}
	
	@RPC
	function pressStrafeLeft(player : NetworkPlayer) {
	//	if(Network.player == player)
			strafeLeft = true;
	}
	
	@RPC
	function pressStrafeRight(player : NetworkPlayer) {
	//	if(Network.player == player)
			strafeRight = true;
	}
	
	@RPC
	function releaseForward(player : NetworkPlayer) {
	//	if(Network.player == player)
			forward = false;	
			Debug.Log("released");
	}
	
	@RPC
	function releaseBackward(player : NetworkPlayer) {
	//	if(Network.player == player)
			backward = false;	
	}
		
	@RPC
	function releaseTurnLeft(player : NetworkPlayer) {
	//	if(Network.player == player)
			turnLeft = false;		
	}
	
	@RPC
	function releaseTurnRight(player : NetworkPlayer) {
	//	if(Network.player == player)
			turnRight = false;	
	}
	
	@RPC
	function releaseStrafeLeft(player : NetworkPlayer) {
	//	if(Network.player == player)
			strafeLeft = false;	
	}
	
	@RPC
	function releaseStrafeRight(player : NetworkPlayer) {
	//	if(Network.player == player)
			strafeRight = false;	
	}
	
	@RPC
	function RPCTest() {
		Debug.Log("words");
	}
}