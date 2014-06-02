#pragma strict

class SimulatedServerTest extends Photon.MonoBehaviour {
	function Update () {
		if(Input.GetKeyDown("a")){// && !PhotonNetwork.isMasterClient)  {
			var pView : PhotonView = PhotonView.Get(this);
			// want to try AllViaServer
			pView.RPC("ChangeColor",PhotonTargets.AllViaServer);//PhotonTargets.MasterClient);
			Debug.Log("Press Time : "+Time.time);
		}
	}

	@RPC
	function ChangeColor(){
	/*	if(PhotonNetwork.isMasterClient) {
		var pView : PhotonView = PhotonView.Get(this);
			pView.RPC("ChangeColor",PhotonTargets.Others);
		}*/
		
		Debug.Log("Execute Time : "+Time.time);	
		renderer.material.color = Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0));
	}
}