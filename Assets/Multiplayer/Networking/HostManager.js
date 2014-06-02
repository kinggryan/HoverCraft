class HostManager extends MonoBehaviour
{
	public var chasisType : GameObject;

    private static var ScenePhotonView : PhotonView;

    // Use this for initialization
    public function Start()
    {
        ScenePhotonView = GetComponent(PhotonView);
        	Physics.gravity = Vector3(0,0,0);
	
		// initialize start body
		var plate : GameObject = GameObject.Find("HoverPlate");
		var plateAttachedPieces : MachinePieceAttachments = GameObject.Find("HoverPlate").GetComponent("MachinePieceAttachments");
		plateAttachedPieces.clearAttachments();
		plateAttachedPieces.connectedObjects[4] = GameObject.Instantiate(chasisType,plate.transform.TransformPoint(Vector3(0,3.5,0)),plate.transform.rotation);
		plate.gameObject.GetComponent(FixedJoint).connectedBody = plateAttachedPieces.connectedObjects[4].rigidbody;
		var otherAttachedPieces : MachinePieceAttachments = plateAttachedPieces.connectedObjects[4].GetComponent("MachinePieceAttachments");
		otherAttachedPieces.clearAttachments();
		otherAttachedPieces.connectedObjects[0] = plate.gameObject;
		//rootPiece = plateAttachedPieces.connectedObjects[4].gameObject;
		plate.rigidbody.freezeRotation = true;
    }

    public function OnJoinedRoom()
    {
       
    }

    public function OnPhotonPlayerConnected(player : PhotonPlayer)
    {
        Debug.Log("OnPhotonPlayerConnected: " + player);

        // when new players join, we send "who's it" to let them know
        // only one player will do this: the "master"

        if (PhotonNetwork.isMasterClient)
        {
            Debug.Log("You are host");
        }
        else
        {
        	Debug.Log("You are not host");
        }
    }

    public function OnPhotonPlayerDisconnected(player : PhotonPlayer)
    {
        Debug.Log("OnPhotonPlayerDisconnected: " + player);
    }

    public function OnMasterClientSwitched()
    {
        Debug.Log("OnMasterClientSwitched");
    }
    
    @RPC
    public function StartGravity(){
    		Physics.gravity = Vector3(0,-9.8,0);
		Debug.Log("Gravity on");

		var getController : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		getController.actionMode = 1;
		
		for(var currRotate in GameObject.FindObjectsOfType(RotationGrabber))
			GameObject.Destroy(currRotate.gameObject);
	
		// activate rotation and collision for all pieces
		for(var currObject in GameObject.FindGameObjectsWithTag("piece"))
		{
			if(currObject.rigidbody != null)
			{
				currObject.GetComponent(Rigidbody).freezeRotation = false;
				currObject.GetComponent(Rigidbody).detectCollisions = true;
			}
			else
				Debug.Log("No rigidbody on object " + currObject);
		}
	
		getController.SwitchToPlayMode();
    }
}
