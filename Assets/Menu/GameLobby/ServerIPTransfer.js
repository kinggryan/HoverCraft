#pragma strict

// Transfers IP address of host via observation

class ServerIPTransfer extends Photon.MonoBehaviour {
	var IP : String;
	var port : int;
	var connectViaUnityNetwork : boolean = false;		// since RPCs are mysteriously not working, we will mark this as true to trigger the unity
											// 	connection on clients

	function OnPhotonSerializeView(stream : PhotonStream, info : PhotonMessageInfo ) {
		if (stream.isWriting)
        {
            // We own this player: send the others our data
            stream.SendNext(IP);
            stream.SendNext(port);
            stream.SendNext(connectViaUnityNetwork);
        }
        else
        {
            // Network player, receive data
            IP = stream.ReceiveNext();
            port = stream.ReceiveNext();
            connectViaUnityNetwork = stream.ReceiveNext();
            
            if(connectViaUnityNetwork) {
            	var glGUI : GameLobbyGUI = GetComponent(GameLobbyGUI);
            	gameObject.Destroy(this);
            	glGUI.ConnectToServerViaUnity(IP,port);
            }
        }
	}
}