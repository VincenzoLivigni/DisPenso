import { allExpiringProducts } from "../services/api"
import { useEffect,useState } from "react"
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator, 
    Image 
} from "react-native";


export default function Carosello() {

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])

     type dataExpiring = {
        "id": String,
        "name": String,
        "brand": String | null,
        "image_url": String | null,
        "quantity": Number,
        "expiration_date": String,
        "daysLeft": Number,
        "pantry": {
            "id": String,
            "name": String
        }
    }

    async function loadExpiring() {
        try {
            setLoading(true)
            const data = await allExpiringProducts()
            setProducts(data)
        
        }
        catch(err){
            console.log(err,'errore nel recupero delle scadenze');
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(()=>{
      loadExpiring()
      console.log(setProducts)
    },[])



    return(
        <>
        <Text>
            CAROSELLOOOOOOOOOONE
        </Text>
        </>
    )
}