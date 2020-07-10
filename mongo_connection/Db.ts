import { MongoClient, Database } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.8.0/mod.ts";


export default class Db{

	client = new MongoClient();
	db_name:string = "";

	constructor(uri: string, db_name: string){
		this.startConnection(uri)
		this.db_name = db_name;
	}

	startConnection = (uri: string) => {
		this.client.connectWithUri(uri);
	}

	createDocument = async (collection_name: string, object: any)=>{
		const db = this.client.database(this.db_name);
		const collection = db.collection(collection_name);
		const insertId = await collection.insertOne(object);
		return await insertId.$oid;
	}
	
	updateDocument = async (collection_name: string, id:string, prop:string, new_value: any)=>{
		const db = this.client.database(this.db_name);
		const collection = db.collection(collection_name);
		try{
			await collection.updateOne({_id:ObjectId(id)}, { $set: {[prop]:new_value}});
			return true;
		}catch(err){
			console.log(err)
			return false;
		}
	}

	readSingleDocument = async (collection_name: string, id: string)=>{
		const db = this.client.database(this.db_name);
		const collection = db.collection(collection_name);
		try{
			const document = await collection.findOne({ _id: ObjectId(id) });
			return document;
		}catch(err){
			console.log(err)
			return null;
		}
	}
	readAllDocuments = async (collection_name: string)=>{
		const db = this.client.database(this.db_name);
		const collection = db.collection(collection_name);
		try{
			const all_documents = await collection.find({});
			return all_documents;
		}catch(err){
			console.log(err)
			return null;
		}
	}

}

