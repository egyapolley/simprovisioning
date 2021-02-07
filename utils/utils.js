
const soapRequest = require("easy-soap-request");
const parser = require('fast-xml-parser');
const he = require('he');
const options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: true,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false,
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
    tagValueProcessor: (val, tagName) => he.decode(val),
    stopNodes: ["parse-me-as-string"]
};


async function create_Hss_Auc(imsi, authKeys) {
    let msin = imsi.toString().substring(5);

    const URL="http://172.21.7.6:18100/";

    const sampleHeaders = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '',
    };

    let xmlRequest=`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:al="http://www.alcatel-lucent.com/soap_cm" xmlns:bd="http://www.3gpp.org/ftp/Specs/archive/32_series/32607/schema/32607-700/BasicCMIRPData" xmlns:bs="http://www.3gpp.org/ftp/Specs/archive/32_series/32607/schema/32607-700/BasicCMIRPSystem" xmlns:gd="http://www.3gpp.org/ftp/Specs/archive/32_series/32317/schema/32317-700/GenericIRPData" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <SOAP-ENV:Body>
      <bd:createMO>
         <mOIElementLoc>aucServiceProfileId=1,mSubIdentificationNumberId=${msin},mobileNetworkCodeId=08,mobileCountryCodeId=620,plmnFunctionId=1,managedElementId=HSS1</mOIElementLoc>
         <referenceObjectInstance />
         <mO>
            <moiLocation>aucServiceProfileId=1,mSubIdentificationNumberId=${msin},mobileNetworkCodeId=08,mobileCountryCodeId=620,plmnFunctionId=1,managedElementId=HSS1</moiLocation>
            <al:moAttributeList>
               <al:moAttribute>
                  <al:name>authenticationSubscriberType</al:name>
                  <al:value>UMTS_MS</al:value>
               </al:moAttribute>
               <al:moAttribute>
                  <al:name>authKey</al:name>
                  <al:value>${authKeys}</al:value>
               </al:moAttribute>
               <al:moAttribute>
                  <al:name>algorithmPosition</al:name>
                  <al:value>1</al:value>
               </al:moAttribute>
               <al:moAttribute>
                  <al:name>allowedSequenceNumber</al:name>
                  <al:value>PS</al:value>
                  <al:value>EPS</al:value>
                  <al:value>IMS</al:value>
               </al:moAttribute>
            </al:moAttributeList>
         </mO>
      </bd:createMO>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    const {response} = await soapRequest({url: URL, headers: sampleHeaders, xml: xmlRequest, timeout: 6000}); // Optional timeout parameter(milliseconds)
    const {body} = response;
    let jsonObj = parser.parse(body, options);
    let result = jsonObj.Envelope.Body;

    return  !!(result.createMOResponse && result.createMOResponse.mO && result.createMOResponse.mO.moiLocation);


}

async function create_Hss_Sub(msisdn, profileID,imsi) {

    const URL="http://172.21.7.6:18100/";

    let msin = imsi.toString().substring(5);
    const sampleHeaders = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '',
    };

    let xmlRequest=`<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:bd="http://www.3gpp.org/ftp/Specs/archive/32_series/32607/schema/32607-700/BasicCMIRPData" xmlns:bs="http://www.3gpp.org/ftp/Specs/archive/32_series/32607/schema/32607-700/BasicCMIRPSystem" xmlns:gd="http://www.3gpp.org/ftp/Specs/archive/32_series/32317/schema/32317-700/GenericIRPData" xmlns:mO="http://www.alcatel-lucent.com/soap_cm" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <SOAP-ENV:Body>
      <bd:createMO>
         <mOIElementLoc>gsmServiceProfileId=1,suMSubscriptionProfileId=1,suMSubscriberProfileId=1-${profileID},subscriptionFunctionId=1,managedElementId=HSS1</mOIElementLoc>
         <referenceObjectInstance />
         <mO>
            <moiLocation>gsmServiceProfileId=1,suMSubscriptionProfileId=1,suMSubscriberProfileId=1-${profileID},subscriptionFunctionId=1,managedElementId=HSS1</moiLocation>
            <mO:moAttributeList>
               <mO:moAttribute>
                  <mO:name>mSubIdentificationNumberId</mO:name>
                  <mO:value>${msin}</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>mobileCountryCodeId</mO:name>
                  <mO:value>620</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>mobileNetworkCodeId</mO:name>
                  <mO:value>08</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>MainSNwithBearerService</mO:name>
                  <mO:value>${msisdn.substring(0,3)}-${msisdn.substring(3,5)}-${msisdn.substring(5)}:GPRS</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>networkAccessMode</mO:name>
                  <mO:value>GPRSonly</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>accessRestrictionData</mO:name>
                  <mO:value>NORES</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>epsAccessSubscriptionType</mO:name>
                  <mO:value>3GPP</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>maxRequestedBandwidthDL</mO:name>
                  <mO:value>104857600</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>maxRequestedBandwidthUL</mO:name>
                  <mO:value>503316480</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>epsApnContextSetList</mO:name>
                  <mO:value>1/5/3GPP///AC150F12/////3GPP/0</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>apnOiReplacement</mO:name>
                  <mO:value>mnc008.mcc620.gprs</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>ratFreqSelectPriorityId</mO:name>
                  <mO:value>1</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>epsServiceProfile</mO:name>
                  <mO:value>true</mO:value>
               </mO:moAttribute>
               <mO:moAttribute>
                  <mO:name>chargingCharacteristics</mO:name>
                  <mO:value>PREPAID</mO:value>
               </mO:moAttribute>
            </mO:moAttributeList>
         </mO>
      </bd:createMO>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`;

    const {response} = await soapRequest({url: URL, headers: sampleHeaders, xml: xmlRequest, timeout: 6000}); // Optional timeout parameter(milliseconds)
    const {body} = response;
    let jsonObj = parser.parse(body, options);
    let result = jsonObj.Envelope.Body;

    return  !!(result.createMOResponse && result.createMOResponse.mO && result.createMOResponse.mO.moiLocation);


}

async function create_Pcrf(msisdn, profileID,imsi) {
    const URL="http://172.21.4.36:8090/provisioningapi/51/subscriber"
    const sampleHeaders = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '',
    };

    let xmlRequest=`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:com="http://www.alcatellucent.com/dsc/provisioningapi/51/common" xmlns:sub="http://www.alcatellucent.com/dsc/provisioningapi/51/subscriber" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Header>
      <com:header>
         <com:clientAppId>ASAP</com:clientAppId>
         <com:requestId>AIA_A63B14016D9200F4E053AC192290C0A5</com:requestId>
      </com:header>
   </soapenv:Header>
   <soapenv:Body>
      <sub:addAccount>
         <sub:account>
            <sub:accountId>1-${profileID}</sub:accountId>
            <sub:subscribers>
               <sub:subscriber>
                  <sub:userId>1-${profileID}</sub:userId>
                  <sub:category>Silver</sub:category>
                  <sub:description />
                  <sub:state>ENABLED</sub:state>
                  <sub:subscriptionIds>
                     <sub:subscriptionId>
                        <sub:value>${msisdn}</sub:value>
                        <sub:type>END_USER_E164</sub:type>
                     </sub:subscriptionId>
                     <sub:subscriptionId>
                        <sub:value>${imsi}</sub:value>
                        <sub:type>END_USER_IMSI</sub:type>
                     </sub:subscriptionId>
                  </sub:subscriptionIds>
                  <sub:customData>
                     <sub:item>
                        <sub:name>AtHome</sub:name>
                        <sub:value>
                           <sub:type>ENUM</sub:type>
                           <sub:data>BooleanEnum.TRUE</sub:data>
                        </sub:value>
                     </sub:item>
                     <sub:item>
                        <sub:name>HomeZone</sub:name>
                        <sub:value>
                           <sub:type>STRING</sub:type>
                           <sub:data>A</sub:data>
                        </sub:value>
                     </sub:item>
                     <sub:item>
                        <sub:name>WalledGarden</sub:name>
                        <sub:value>
                           <sub:type>ENUM</sub:type>
                           <sub:data>BooleanEnum.TRUE</sub:data>
                        </sub:value>
                     </sub:item>
                     <sub:item>
                        <sub:name>Postpaid</sub:name>
                        <sub:value>
                           <sub:type>ENUM</sub:type>
                           <sub:data>BooleanEnum.FALSE</sub:data>
                        </sub:value>
                     </sub:item>
                  </sub:customData>
               </sub:subscriber>
            </sub:subscribers>
         </sub:account>
      </sub:addAccount>
   </soapenv:Body>
</soapenv:Envelope>`;

    const {response} = await soapRequest({url: URL, headers: sampleHeaders, xml: xmlRequest, timeout: 6000}); // Optional timeout parameter(milliseconds)
    const {body} = response;
    let jsonObj = parser.parse(body, options);
    let result = jsonObj.Envelope.Body;

    return  !!(result.addAccountResponse);


}

async function create_IN(msisdn) {

    const URL="http://172.25.39.13:3004";

    const sampleHeaders = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '',
    };

    let xmlRequest=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pi="http://xmlns.oracle.com/communications/ncc/2009/05/15/pi">
   <soapenv:Header/>
   <soapenv:Body>
      <pi:CCSCD1_ADD>
         <pi:username>admin</pi:username>
         <pi:password>admin</pi:password>
         <pi:PROVIDER>Surfline</pi:PROVIDER>
         <pi:PRODUCT>NewPrepaidOffer</pi:PRODUCT>
         <pi:CURRENCY>GHS</pi:CURRENCY>
         <pi:INITIAL_STATE>P</pi:INITIAL_STATE>
         <pi:LANGUAGE>English</pi:LANGUAGE>
         <pi:MAX_CONCURRENT_ACCESS>10</pi:MAX_CONCURRENT_ACCESS>
         <pi:MSISDN>${msisdn}</pi:MSISDN>
      </pi:CCSCD1_ADD>
   </soapenv:Body>
</soapenv:Envelope>`;

    const {response} = await soapRequest({url: URL, headers: sampleHeaders, xml: xmlRequest, timeout: 6000}); // Optional timeout parameter(milliseconds)
    const {body} = response;
    let jsonObj = parser.parse(body, options);
    let result = jsonObj.Envelope.Body;

    return  !!(result.CCSCD1_ADDResponse && result.CCSCD1_ADDResponse.ACCOUNT_NUMBER);


}

async function update_IN_tags(msisdn, imsi,profileID, imei="",  deviceType="") {

    const URL="http://172.25.39.13:3004";

    const sampleHeaders = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '',
    };

    let xmlRequest=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pi="http://xmlns.oracle.com/communications/ncc/2009/05/15/pi">
   <soapenv:Header/>
   <soapenv:Body>
      <pi:CCSCD9_CHG>
         <pi:username>admin</pi:username>
         <pi:password>admin</pi:password>
         <pi:MSISDN>${msisdn}</pi:MSISDN>
         <pi:TAG>IMSI|SPEED|DeviceType|IMEI|AccountId</pi:TAG>
         <pi:VALUE>${imsi}|14|${deviceType}|${imei}|${profileID}</pi:VALUE>
      </pi:CCSCD9_CHG>
   </soapenv:Body>
</soapenv:Envelope>`;

    const {response} = await soapRequest({url: URL, headers: sampleHeaders, xml: xmlRequest, timeout: 6000}); // Optional timeout parameter(milliseconds)
    const {body} = response;
    let jsonObj = parser.parse(body, options);
    let result = jsonObj.Envelope.Body;
    return  !!(result.CCSCD9_CHGResponse && result.CCSCD9_CHGResponse.AUTH);

}













module.exports = {

    create_Hss_Auc,
    create_Hss_Sub,
    create_Pcrf,
    create_IN,
    update_IN_tags

}
