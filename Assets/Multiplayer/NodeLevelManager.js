#pragma strict

class NodeLevelManager extends LevelManager {
	var RedTeam : ArrayList;
	var BlueTeam : ArrayList;
	
	var RedTeamNumberOfControlledPoints  : int;			// set these on actual level
	var BlueTeamNumberOfControlledPoints : int;
	
	var RedTeamScoreTexture : Texture;
	var BlueTeamScoreTexture : Texture;
	var ScoreBarToScreenEdgeBuffer = 100;
	
	var nodePointValue = 1.0;		//	points per second per node. increases in overtime
	var score : float = 0.0;
	var VICTORY_SCORE = 1.0 * 60 * 10;			// 1 point every second for 10 minutes. assuming a team up one node will gain 10 points every minute.
	
	var INITIAL_OVERTIME_TIMER = 8 * 60; // ten minutes
	var SECONDARY_OVERTIME_TIMER = 2 * 60;	// 2 minutes
	var NODE_POINT_VALUE_OVERTIME_MULTIPLIER = 1.5;	//	every overtime tick increase the node point value by this amount.
	
	function Update() {
		if(NetworkManager.inServerMode) {
			score += (BlueTeamNumberOfControlledPoints - RedTeamNumberOfControlledPoints) * nodePointValue * Time.deltaTime;	//	blue team is positive, red negative
		
			if(Mathf.Abs(score) >= VICTORY_SCORE) {
				if(score < 0) {
					Debug.Log("RED TEAM WINS");
					// TODO make team winning stuff
				}
				else {
					Debug.Log("BLUE TEAM WINS");
					// TODO make team winning stuff
				}
			}
		}
	}
	
	function IncreaseOvertime(delay : float) : IEnumerator {
		yield WaitForSeconds(delay);
		
		nodePointValue *= NODE_POINT_VALUE_OVERTIME_MULTIPLIER;
		
		IncreaseOvertime(SECONDARY_OVERTIME_TIMER);
	}
	
	function OnGUI() {
		GUI.Box(Rect(ScoreBarToScreenEdgeBuffer,12,Screen.width - (2*ScoreBarToScreenEdgeBuffer),26),"");
		var scoreRatio : float;
		var scoreBarWidth : float;
		if(score > 0) {
			scoreRatio = score / VICTORY_SCORE;
			scoreBarWidth = scoreRatio * ((Screen.width/2) - ScoreBarToScreenEdgeBuffer);
			GUI.DrawTexture(Rect((Screen.width / 2),15,scoreBarWidth,20),BlueTeamScoreTexture);
		} 
		else if(score < 0) {
			scoreRatio = -score / VICTORY_SCORE;
			scoreBarWidth = scoreRatio * ((Screen.width/2) - ScoreBarToScreenEdgeBuffer);
			GUI.DrawTexture(Rect((Screen.width / 2) - scoreBarWidth,15,scoreBarWidth,20),RedTeamScoreTexture);
		}
	}
	
	function StartGame() {
		SetTeams();
		StartCoroutine(IncreaseOvertime(INITIAL_OVERTIME_TIMER));
	}
	
	// SERVER-ONLY - Call this function after the correct number of players has joined the game. 
	function SetTeams() {
		networkView.RPC("InitializeTeamsOnClient",RPCMode.Others);
	
		RedTeam = new ArrayList();
		BlueTeam = new ArrayList();
		var unteamedPlayers = new ArrayList();
		
		for(var i = 0 ; i < playersInGameCount ; i++) {
			unteamedPlayers.Add(NetworkManager.PlayerNumberHashtable[i]);
		}
		
		var teamToAddTo = 0;
		
		while(unteamedPlayers.Count > 0) {
			var randomValue = Random.value;
			while(randomValue == 1.0)
				randomValue = Random.value;
			var playerIndex : int = Mathf.FloorToInt(randomValue * playersInGameCount);
		
			if(teamToAddTo == 0) {
				RedTeam.Add(unteamedPlayers[playerIndex]);
				PlayerData.GetPlayerData(unteamedPlayers[playerIndex]).SetTeamOnAllClients(0);
				networkView.RPC("AssignPlayerToTeam",RPCMode.Others,unteamedPlayers[playerIndex],0);
			}
			else {
				BlueTeam.Add(unteamedPlayers[playerIndex]);
				PlayerData.GetPlayerData(unteamedPlayers[playerIndex]).SetTeamOnAllClients(1);
				networkView.RPC("AssignPlayerToTeam",RPCMode.Others,unteamedPlayers[playerIndex],1);
			}
			
			unteamedPlayers.RemoveAt(playerIndex);
			teamToAddTo = (teamToAddTo + 1) % 2;
		}
	}
	
	@RPC
	function InitializeTeamsOnClient() {
		RedTeam = new ArrayList();
		BlueTeam = new ArrayList();
	}
	
	@RPC
	function AssignPlayerToTeam(player : NetworkPlayer, team : int) {
		if(team == 0) {
			RedTeam.Add(player);
			Debug.LogError("Player : " +player+" joined red team");
		}
		else {
			BlueTeam.Add(player);
			Debug.LogError("Player : " +player+" joined blue team");
		}
	}
	
	// This syncs the score between all players
	function OnSerializeNetworkView(stream : BitStream, info : NetworkMessageInfo) {
		var tempScore : float;
		if(stream.isWriting) {
			tempScore = score;
			stream.Serialize(tempScore);
		}
		else {
			stream.Serialize(tempScore);
			score = tempScore;
		}
	}
}