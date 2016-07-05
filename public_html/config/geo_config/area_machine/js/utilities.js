/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/GEO_CONFIG/AREA_MACHINE/JS
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