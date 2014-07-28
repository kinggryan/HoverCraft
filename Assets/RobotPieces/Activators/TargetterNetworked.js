#pragma strict

// Targetter Network Class. RGK 7-21-14
// This component is attached to a Piece and governs the movement of the piece when it is currently being aimed via mouse. 

/*	Server Side Handles : 
	- Receiving aim inputs and fire inputs
	- calculate new rotation and limiting new rotation
	- call activation functions when needed

	Client Side Handles :
	- Sending inputs
	*/

private var XAimLimits : float;
private var YAimLimits : float;
private var	xAngle : float;
private var yAngle : float;
private var aimSpeed : float;
private var initialRotation : Quaternion;

// input data
public var rotationX : float;
public var rotationY : float;
private var clicked		: boolean;

function Start () {
	// set up limits
	if(Network.isServer) {
		var BM : BattleManager = GetComponent(BattleManager);
		XAimLimits = BM.XAimLimits;
		YAimLimits = BM.YAimLimits;
		xAngle = 0;
		yAngle = 0;
		aimSpeed = BM.aimDegreesPerSecond;
	
		initialRotation = transform.localRotation;
	}
}

function OnSerializeNetworkView(stream : BitStream, info : NetworkMessageInfo) {
	var tempX : float;
	var tempY : float;

	if (stream.isWriting) {
		Debug.LogError("writing...");
		tempX = rotationX;
		tempY = rotationY;
		stream.Serialize(tempX);
		stream.Serialize(tempY);
	} 
	else {
		Debug.LogError("reading...");
		tempX = 0;
		tempY = 0;
		stream.Serialize(tempX);
		stream.Serialize(tempY);
		rotationX = tempX;
		rotationY = tempY;
	}	
}

function Update () {
	if(Network.isServer) {
		var aimSpeedDT = Time.deltaTime * aimSpeed;
		
		var changedRotationX = Mathf.Clamp(rotationX, -aimSpeedDT, aimSpeedDT);
		var changedRotationY = Mathf.Clamp(rotationY, -aimSpeedDT, aimSpeedDT);
		
		xAngle += changedRotationX;
		yAngle += changedRotationY;
		var diff : float;
	
		// apply limits
		if(xAngle > XAimLimits) {
			diff = xAngle - XAimLimits;
			xAngle = XAimLimits;
			changedRotationX -= diff;
		}
		if(xAngle < -XAimLimits) {
			diff = xAngle + XAimLimits;
			xAngle = -XAimLimits;
			changedRotationX -= diff;
		}
		if(yAngle > YAimLimits) {
			diff = yAngle - YAimLimits;
			yAngle = YAimLimits;
			changedRotationY -= diff;
		}
		if(yAngle < -YAimLimits) {
			diff = yAngle + YAimLimits;
			yAngle = -YAimLimits;
			changedRotationY -= diff;
		} 
	
		// rotate obj
		transform.Rotate(0, changedRotationX, 0, Space.World);
		transform.Rotate(changedRotationY,0,0);
	}
	else { //network is client
		var sensitivityX = 15F;
		var sensitivityY = 15F;
		
		rotationX = Input.GetAxis("Mouse X") * sensitivityX;
		rotationY = Input.GetAxis("Mouse Y") * sensitivityY;
		
		// Activate piece
		if(Input.GetMouseButtonDown(0))
			networkView.RPC("ClientMouseStateChanged",RPCMode.Server,true);
		if(Input.GetMouseButtonUp(0))
			networkView.RPC("ClientMouseStateChanged",RPCMode.Server,false);
	}
}

/********

	Server Side Block
	
	********/
	
@RPC
function ClientMouseStateChanged(clientClicked : boolean) {
	var conn : Connector = GetComponent(Connector);
	if(!clicked && clientClicked) {
		conn.ActivateNetworked();
	}
	else if (clicked && !clientClicked) {
		conn.DeActivate();
	}
	
	clicked = clientClicked;
}

function FixedUpdate()
{
	if(Network.isServer && Input.GetMouseButton(0))
	{	
		var conn : Connector = GetComponent(Connector);
		conn.FixedActivate();
	}
}

function OnDestroy() {
	if(Network.isServer)
		transform.localRotation = initialRotation;
}