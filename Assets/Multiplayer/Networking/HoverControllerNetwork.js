#pragma strict

// HoverControllerNetwork class
// Component attaches to hoverplate on players and servers. 
//		the player who owns the networkView can send commands to the server via RPCS
// 		the server takes these RPCs and adjusts the simulation to take account of them
//		other players simply see the results of the simulation

class HoverControllerNetwork extends MonoBehaviour {
	public var controlledByMe : boolean = false;
	public var controller : NetworkPlayer;

	// indicate if the button is being held by the player. Kept track of by the server		
	private var forward 	: boolean = false;
	private var backward 	: boolean = false;
	private var turnLeft 	: boolean = false;
	private var turnRight 	: boolean = false;
	private var strafeLeft 	: boolean = false;
	private var strafeRight	: boolean = false;
	
	// Simulation Relevant Constants
	private var ADJUSTMENT_CORRECTION_CHANGE_RATE = 10; //.24;
	private var MAXIMUM_FORWARD_VELOCITY = 40;
	private var MAXIMUM_TURN_RATE = 2;
	private var MAXIMUM_STRAFE_VELOCITY = 30;
	private var BACKWARDS_TO_FORWARDS_SPEED_RATIO = .5;
	
	// Simulation Relevant Variables
	private var lifter : ConstantForce;
	private var upwardsCorrectionAccelerations : float[];
	private var downwardsCorrectionAccelerations : float[];
	private var previousPoints : Vector3[];
	private var previousDistances : float[];
	
/*
*	Owner Update
*/
	
	function Update() {
		// start player control block
		if(controlledByMe) {
			if(Input.GetKeyDown("w"))
				networkView.RPC("pressForward",RPCMode.Server);
			if(Input.GetKeyDown("s"))
				networkView.RPC("pressBackward",RPCMode.Server);
			if(Input.GetKeyDown("a"))
				networkView.RPC("pressTurnLeft",RPCMode.Server);
			if(Input.GetKeyDown("d"))
				networkView.RPC("pressTurnRight",RPCMode.Server);
			if(Input.GetKeyDown("q"))
				networkView.RPC("pressStrafeLeft",RPCMode.Server);
			if(Input.GetKeyDown("e"))
				networkView.RPC("pressStrafeRight",RPCMode.Server);
			
			if(Input.GetKeyUp("w"))
				networkView.RPC("releaseForward",RPCMode.Server);
			if(Input.GetKeyUp("s"))
				networkView.RPC("releaseBackward",RPCMode.Server);
			if(Input.GetKeyUp("a"))
				networkView.RPC("releaseTurnLeft",RPCMode.Server);
			if(Input.GetKeyUp("d"))
				networkView.RPC("releaseTurnRight",RPCMode.Server);
			if(Input.GetKeyUp("q"))
				networkView.RPC("releaseStrafeLeft",RPCMode.Server);
			if(Input.GetKeyUp("e"))
				networkView.RPC("releaseStrafeRight",RPCMode.Server);
			
			if(Input.GetKey("g"))
				networkView.RPC("RPCTest",RPCMode.Server);
		} // end of player controlled block
	}
	
/*
*	All input RPCs
*/
	@RPC
	function pressForward() {
			forward = true;
	}
	
	@RPC
	function pressBackward() {
			backward = true;
	}
	
	@RPC
	function pressTurnLeft() {
			turnLeft = true;
	}
	
	@RPC
	function pressTurnRight() {
			turnRight = true;
	}
	
	@RPC
	function pressStrafeLeft() {
			strafeLeft = true;
	}
	
	@RPC
	function pressStrafeRight() {
			strafeRight = true;
	}
	
	@RPC
	function releaseForward() {
			forward = false;	
	}
	
	@RPC
	function releaseBackward() {
			backward = false;	
	}
		
	@RPC
	function releaseTurnLeft() {
			turnLeft = false;		
	}
	
	@RPC
	function releaseTurnRight() {
			turnRight = false;	
	}
	
	@RPC
	function releaseStrafeLeft() {
			strafeLeft = false;	
	}
	
	@RPC
	function releaseStrafeRight() {
			strafeRight = false;	
	}
	
	
/*
*	Server-side fixed update
*/

	function FixedUpdate() {
		// run fixed update processes on server
		if(Network.isServer) {
			var liftPoint = Vector3(.5,0,.4);
	
			for(var i = 0 ; i < 4 ; i++)
			{
				var forceAdjustment = 0;
		
				var hitInfo : RaycastHit;
				var layermask = 1 << 8;
				Physics.Raycast(transform.TransformPoint(liftPoint),Vector3.down,hitInfo,Mathf.Infinity,layermask);
	
				if(hitInfo.distance - previousDistances[i] > 0)
				{
					forceAdjustment -= downwardsCorrectionAccelerations[i];
					downwardsCorrectionAccelerations[i] += ADJUSTMENT_CORRECTION_CHANGE_RATE;
					upwardsCorrectionAccelerations[i] = ADJUSTMENT_CORRECTION_CHANGE_RATE;
				}
				else if(hitInfo.distance - previousDistances[i] < 0)
				{
					forceAdjustment += upwardsCorrectionAccelerations[i];
					upwardsCorrectionAccelerations[i] += ADJUSTMENT_CORRECTION_CHANGE_RATE;
					downwardsCorrectionAccelerations[i] = ADJUSTMENT_CORRECTION_CHANGE_RATE;
				}
			
				rigidbody.AddForceAtPosition(((99*Vector3(0,Mathf.Min(Mathf.Pow(5.5-hitInfo.distance,3),1000),0))+Vector3(0,forceAdjustment,0)),transform.TransformPoint(liftPoint));

				previousDistances[i] = hitInfo.distance;
	
				if(i % 2 == 0)
					liftPoint.x *= -1;
				if(i == 1)
					liftPoint.z *= -1;
			}
	
			var hMove : float = 0;
			var vMove : float = 0;
			var strafe : float = 0;
	
			if(forward)
				vMove = 1;
			if(backward)
				vMove -= 1 * BACKWARDS_TO_FORWARDS_SPEED_RATIO;
			if(turnRight)
				hMove += 1;
			if(turnLeft)
				hMove -= 1;
			if(strafeRight)
				strafe += 1;
			if(strafeLeft)
				strafe -= 1;
	
			// Add force based on the desired motion compared to the current motion // -3.96
			rigidbody.AddRelativeForce(Vector3(0,0,36*(MAXIMUM_FORWARD_VELOCITY*vMove - transform.InverseTransformDirection(rigidbody.velocity).z)));
			rigidbody.AddForceAtPosition(transform.TransformDirection(Vector3(0,-7.92*(MAXIMUM_FORWARD_VELOCITY*vMove - transform.InverseTransformDirection(rigidbody.velocity).z),0)),transform.TransformPoint(Vector3(0,0,1)));
			rigidbody.AddRelativeTorque(Vector3(0,200*(MAXIMUM_TURN_RATE*hMove - transform.InverseTransformDirection(rigidbody.angularVelocity).y)),0);
			rigidbody.AddRelativeForce(Vector3(36*(MAXIMUM_STRAFE_VELOCITY*strafe - transform.InverseTransformDirection(rigidbody.velocity).x),0,0));
			rigidbody.AddForceAtPosition(transform.TransformDirection(Vector3(0,-10.2*(MAXIMUM_STRAFE_VELOCITY*strafe - transform.InverseTransformDirection(rigidbody.velocity).x),0)),transform.TransformPoint(Vector3(1,0,0)));
		} // end server side physics block
	}
	
	function Start() {
		// set up simulation server-side
		if(Network.isServer) {
			upwardsCorrectionAccelerations = new float[4];
			downwardsCorrectionAccelerations = new float[4];
			previousPoints = new Vector3[4];
			previousDistances = new float[4];
	
			for(var fl in upwardsCorrectionAccelerations)
				fl = .02;
			for(var fl in downwardsCorrectionAccelerations)
				fl = .02;
	
			var liftPoint = Vector3(.5,0,.4);
	
			for(var i = 0 ; i < 4 ; i++)
			{
				previousPoints[i] = transform.TransformPoint(liftPoint);
		
				if(i % 2 == 0)
					liftPoint.x *= -1;
				if(i == 1)
					liftPoint.z *= -1;
			} 
		}
	}
	
}