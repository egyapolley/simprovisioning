const sequelize = require("./utils/sql_database");
const ProvisionSims = require("./models/sql_models");
const moment = require("moment");


const  path = require("path");
const fs = require("fs");

const utils = require("utils/utils");

sequelize.sync({

}).then(() =>{
    console.log("Sequelize Connected");

    const fileInput = path.join(__dirname,"input_dir","input_file.txt");
    const fileOutput = path.join(__dirname,"output_dir",moment().format("YYYYMMDDHHmmss")+"-input_file.txt")
    fs.readFile(fileInput, async (err, data) => {
        if (err) throw err;
        const dataArray = data.toString().split("\n");
        for (const line of dataArray) {
            if (line){

                const lineArray = line.split(",");
                let msisdn = lineArray[0].trim();
                let imsi = lineArray[1].trim();
                let authKeys =lineArray[2].trim();
                let imei = lineArray[3];
                let deviceType = lineArray[4];

                let profileID = imsi.substring(8);
                try {
                    if (await utils.create_Hss_Auc(imsi,authKeys)){
                        process.stdout.write(`${msisdn} created on HSS_Auc`)
                        if (await utils.create_Hss_Sub(msisdn,profileID,imsi)){
                            process.stdout.write(`|HSS_Sub`)
                            if (await utils.create_Pcrf(msisdn,profileID,imsi)){
                                process.stdout.write(`|PCRF`)
                                if (await utils.create_IN(msisdn)){
                                    if (await utils.update_IN_tags(msisdn,imsi,profileID,imei,deviceType)){
                                        process.stdout.write(`|IN \n` );
                                       const provisioned_sim= await ProvisionSims.create({msisdn,imsi, authKeys,profileID,fileName:fileInput,deviceType,imei});
                                       if (provisioned_sim){
                                           console.log(`${msisdn} provisioned successfully E2E`);

                                       }


                                    }else {
                                        console.log(`${msisdn} failed to update AccountId on IN. Exiting...`);
                                        process.exit(1)

                                    }
                                }else {
                                    console.log(`${msisdn} failed to create on IN. Exiting...`);
                                    process.exit(1)

                                }
                            }else {
                                console.log(`${msisdn} failed to create on PCRF. Exiting...`);
                                process.exit(1)

                            }
                        }else {
                            console.log(`${msisdn} failed to create on HSS_Sub. Exiting...`);
                            process.exit(1)

                        }
                    }else {
                        console.log(`${msisdn} failed to create on HSS_Auc. Exiting...`);
                        process.exit(1)
                    }

                }catch (error){
                    throw error;

                }



            }



        }

        fs.rename(fileInput, fileOutput, err => {
            if (err) throw err;

        })
    })



}).catch(error =>{
    console.log(error);
    console.log("DB error")
})
