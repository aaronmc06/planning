/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH FT. JORGE MURILLO
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/LOCATION_GRADE/JS
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