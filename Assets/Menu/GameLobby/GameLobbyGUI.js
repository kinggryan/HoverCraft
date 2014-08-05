#pragma strict

import Photon;

class GameLobbyGUI extends Photon.MonoBehaviour {
	var machineName : String = "MyDesign";
	var ready = false;
	var playersReadyList : Hashtable;	// says which players are ready to start and which are not

	function Start() {
		if(!Network.isClient && !Network.isServer) {
			// if we are not connected to the unity network, we have just started a new session,
			// so set up a server or attempt to connect to a server
			// if we're the host, try to join our server's room until we do. If we're server, we've already connected
			if(NetworkManager.inServerMode) {
				Debug.LogError("Starting room with name : "+NetworkManager.savedLobbyName);
				Debug.LogError(PhotonNetwork.CreateRoom(NetworkManager.savedLobbyName));
			
				// buffer connect to UnityNetwork via Photon RPC
				var pView : PhotonView = PhotonView.Get(this);
							
				// start server
				var useNat = !Network.HavePublicAddress();
				Debug.Log("Init server... " + Network.InitializeServer(32, 25000, useNat));
			
				// Set up IP transfer so other players can connect to the established server
				var ip : ServerIPTransfer = GetComponent(ServerIPTransfer);
				ip.IP = Network.player.ipAddress;
				ip.port = NetworkManager.portNumber;
			
				// Generate the player number and player ready lists
				playersReadyList = new Hashtable();
			 	NetworkManager.PlayerNumberHashtable = new Hashtable();
			
				if(PhotonNetwork.connected)
					Debug.LogError("connected");
				else
					Debug.LogError("not connected...");
			}
			else {
				// find the photon network lobby so we can get the server's ip
				PhotonNetwork.autoJoinLobby = false;
				PhotonNetwork.ConnectUsingSettings("1");
				Debug.Log("Attempting to Connect");
			}
		}
		else { 
			// We are in a game session
			if(Network.isServer) {
				// Reset player ready table but don't reset player number hashtable. The machine Design hashtable will be reset
				// when the room starts over in the MachineDesignNetworkManager
				playersReadyList = new Hashtable();
				for(var player in Network.connections)
					playersReadyList.Add(player,false);
			}
			else {
				// Clients don't have to do anything here
			}
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
		
		if(PhotonNetwork.inRoom) {
			// display # of players in room -1 (since the server should not count)
			GUI.Label(Rect(200,50,50,50),"Player Count : " + (PhotonNetwork.room.playerCount - 1) + PhotonNetwork.room);
			var yPlacement = 100;
			for(var i = 0; i < PhotonNetwork.room.playerCount; i++) {
				GUI.Label(Rect(200,yPlacement,50,50),"Player: " + PhotonNetwork.playerList[i].ID + " local: "+PhotonNetwork.playerList[i].isLocal);
				yPlacement += 50;
			}
		}
		else
			GUI.Label(Rect(200,50,50,50),"Not in room");
		
		if(NetworkManager.isHost && Network.isClient)
			// if you're host and you're connected to the server, show the start game button
			if(GUI.Button(Rect(15,125,100,100),"Start Game")) {
				var nView : NetworkView = GetComponent("NetworkView");
				// send RPC to start level to server, which checks that all machine designs are loaded. if they are, it starts the level.
				//		otherwise, it doesn't.
				nView.RPC("TryToStartLevelOnServer",RPCMode.Server,LevelDictionary.TEST_LEVEL);
			}
			
		// machine name string
		machineName = GUI.TextField(Rect(15,235,100,25),machineName);
		
		// if we click ready, then check it true if and only if the machine design exists. Also, tell server to load machine design.
		if(!ready && GUI.Button(Rect(125,235,65,25),"Ready?")) {
			var mdnm : MachineDesignNetworkManager = GetComponent(MachineDesignNetworkManager);
			if(mdnm.LocalMachineDesignExists(machineName)) {
				mdnm.SendMachineDesignToServer(machineName);
				ready = true;
				Debug.Log("Loaded and sent");
			}
			else
				Debug.LogError("Design Not Found");
		}
	}
	
	function ReadyPlayer(player : NetworkPlayer) {
		playersReadyList[player] = true;
		var nView : NetworkView = GetComponent(NetworkView);
		nView.RPC("PrintMessage",RPCMode.All,"Player ready.");
	}
	
	@RPC
	function PlayerReady(player : NetworkPlayer) {
		playersReadyList[player] = true;
	}
	
	@RPC
	function PrintMessage(message : String) {
		Debug.Log(message);
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
	
	@RPC
	function OnServerInitialized() {
		var ip : ServerIPTransfer = GetComponent(ServerIPTransfer);
		ip.connectViaUnityNetwork = true;
	}
	
	@RPC
	function StartLevel(levelIndex : int) {
		Debug.LogError("Starting Level : " +levelIndex);
		Application.LoadLevel(levelIndex);
	}
	
	// Called on Server to check if all players are ready
	@RPC
	function TryToStartLevelOnServer(levelIndex : int) {
		var allPlayersReady = true;
		for (playerReady in playersReadyList.Values) {
			if(playerReady == false)
				allPlayersReady = false;
		}
		
		if(allPlayersReady) {
			var nView : NetworkView = GetComponent("NetworkView");
			nView.RPC("PrintMessage",RPCMode.All,"Starting...");
			nView.RPC("StartLevel",RPCMode.All,levelIndex);
		}	
	}
	
	function OnPlayerConnected(player : NetworkPlayer) {
		if(NetworkManager.inServerMode) {
		 	if(player != Network.player)
				playersReadyList.Add(player,false);
				
			Debug.LogError("player connected; ip : " +player.ipAddress +"; player number : "+NetworkManager.PlayerNumberHashtable.Count);
			NetworkManager.PlayerNumberHashtable.Add(NetworkManager.PlayerNumberHashtable.Count,player);
		}
	}
	
	function OnPlayerDisconnected(player : NetworkPlayer) {
		if(NetworkManager.inServerMode) {
			Debug.Log("player disconnected; ip : " +player.ipAddress +"; player number : "+NetworkManager.PlayerNumberHashtable.Count);
			NetworkManager.PlayerNumberHashtable.Remove(player);
			
			// if there's no one left once someone disconnects, then kill the server
			if(Network.connections.Length == 1)
				Application.Quit();
		}
	}
}