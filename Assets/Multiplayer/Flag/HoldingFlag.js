#pragma strict

var homeNode 	: CaptureNode;
var health		: float	= 200;

var HUDTexture	:	Texture;
var flagCaptureObject : GameObject;

private var effectiveMass = 3.0;

function Start() {
	flagCaptureObject = Resources.Load("MapFlag",GameObject);
	if(Network.isServer) {
		gameObject.rigidbody.mass += effectiveMass;
	}
}

/*****************

	Server-Only
	
	**************/
	
function TestBreak() {
	yield WaitForSeconds(3.0);
	
	ReceiveDamage(200);
}
	
function ReceiveDamage(damage : float) {
	health -= damage;
	
	if(health <= 0) {
		var allPlayers : ArrayList = PlayerData.GetAllPlayerData();
		var thisPlayer : PlayerData = GetComponent("PlayerData");
		var shortestDistance = Mathf.Infinity;
		var popDirection : Vector2 = Random.insideUnitCircle;			// initialize pop direction to a random direction
		var popVelocity = 4;
		var verticalPopVelocity = 7;
		
		for(var currPlayer : PlayerData in allPlayers) {
			if(currPlayer.team != thisPlayer.team) {
				var distanceToPlayer = (currPlayer.transform.position - transform.position).magnitude;
				
				if(distanceToPlayer < shortestDistance) {
					shortestDistance = distanceToPlayer;
					popDirection = Vector2(currPlayer.transform.position.x - transform.position.y, currPlayer.transform.position.x - transform.position.y).normalized;
				}
			}
		}
		
		var newFlag = Network.Instantiate(flagCaptureObject,transform.position,Quaternion.identity,0);
		var flagInfo = newFlag.GetComponent(CapturableFlag);
		flagInfo.atHome = false;
		newFlag.rigidbody.AddForce(Vector3(popVelocity * popDirection.x, popVelocity * popDirection.y, verticalPopVelocity));
	}
}

function OnDestroy() {
	if(Network.isServer) {
		gameObject.rigidbody.mass -= effectiveMass;
	}
}

/**************

	Client-Only
	
	**************/

function OnGUI() {

}