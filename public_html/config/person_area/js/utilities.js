/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/METHOD_STEP/JS
	File Name:			utilities.js
=============================================================*/

var lockedForService  = true;

function getURLBeforeLoad() {
	
}

function LockForService() {
	lockedForService = true;
}

function ServiceComplete() {
	lockedForService = false;
}