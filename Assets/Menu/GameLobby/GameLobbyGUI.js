#pragma strict

import Photon;

class GameLobbyGUI extends Photon.MonoBehaviour {

	function Start() {	
		// if we're the host, try to join our server's room until we do. If we're server, we've already connected
		if(NetworkManager.inServerMode) {
			Debug.LogError("Starting room with name : "+NetworkManager.savedLobbyName);
			Debug.LogError(PhotonNetwork.CreateRoom(NetworkManager.savedLobbyName));
			
			// buffer connect to UnityNetwork via Photon RPC
			var pView : PhotonView = PhotonView.Get(this);
			Debug.LogError("pView butt : " +pView +"; id : " +pView.viewID);
			//pView.RPC("TestRPC", PhotonNetwork.player);
			
			var ip : ServerIPTransfer = GetComponent(ServerIPTransfer);
			ip.IP = Network.player.ipAddress;
			ip.port = NetworkManager.portNumber;
			
			if(PhotonNetwork.connected)
				Debug.LogError("connected");
			else
				Debug.LogError("not connected...");
			
			// start server
	//		var useNat = !Network.HavePublicAddress();
	//		Debug.LogError("Init server... " + Network.InitializeServer(32, 25000, useNat));
			

		//	pView.RPC("AllocatePhotonViewID",PhotonTargets.All,viewID);
		//	pView.RPC("ConnectToServerViaUnity",PhotonTargets.AllBufferedViaServer,Network.player.ipAddress,NetworkManager.portNumber);
		}
		else {
			PhotonNetwork.autoJoinLobby = false;
			PhotonNetwork.ConnectUsingSettings("1");
			Debug.Log("Attempting to Connect");
		}
	}	

	function OnConnectedToMaster() {
		Debug.Log("Connected to master");
		if(NetworkManager.isHost) {
			if(!PhotonNetwork.JoinRoom("test")) { //
				Debug.Log("looking...");
				yield WaitForSeconds(1);
			}
			else {
				Debug.Log("FOUND!");
			}
		}
		else {
			PhotonNetwork.JoinRandomRoom();
		}
	}
	
	function OnJoinedLobby(){
		Debug.Log("Joined Lobby");
	}

	function OnFailedToConnectToPhoton() {
		Debug.Log("Failure");
	}
	
	function OnConnectedToPhoton() {
		Debug.Log("Connected");
	}
	
	function OnJoinedRoom() {
		Debug.Log("Joined Room");
	}
	
	function OnPhotonJoinRoomFailed() {
		Debug.Log("Joined Room Failed");
		if(NetworkManager.isHost)
			PhotonNetwork.JoinRoom("test");
		else
			PhotonNetwork.JoinRandomRoom();
	}
	
	function OnGUI() {
		if(GUI.Button(Rect(15,15,200,100),"Kill Server")) {
			var pView : PhotonView = GetComponent("PhotonView");
			pView.RPC("KillServer",PhotonTargets.All);
		}
		
		if(PhotonNetwork.inRoom)
			GUI.Label(Rect(200,50,50,50),"Player Count : " + PhotonNetwork.room.playerCount);
		else
			GUI.Label(Rect(200,50,50,50),"Not in room");
	}
	
	@RPC
	function KillServer() {
		if(NetworkManager.inServerMode) {
			var pView : PhotonView = GetComponent("PhotonView");
			pView.RPC("KillServerCallback",PhotonTargets.All);
			Application.Quit();
		}
	}
	
	@RPC
	function KillServerCallback() {
		Debug.Log("Server Killed");
	}
	
	@RPC
	function ConnectToServerViaUnity(ip : String,port : int) {
		Debug.Log("Attempting to connect to unity server");
		Network.Connect(ip,25000);
	}
	
	function OnConnectedToServer() {
		Debug.Log("Connected To Server Instance");
	}
	
	@RPC
	function AllocatePhotonViewID(id : int) {
		var pView : PhotonView = GetComponent("PhotonView");
		Debug.LogError("view id set");
		pView.viewID = id;
	}
	
	@RPC
	function TestRPC() {
		Debug.LogError("test");
	}
}