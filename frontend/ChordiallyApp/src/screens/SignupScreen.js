
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

const projectId = '0x33c5b8f4d2e4a1b2c3d4e5f6a7b8c9ssd0';

const providerMetadata = {
    name: 'Chordially',
    description: 'Music-powered matching app.',
    url: 'https://chordially.app/',
    icons: ['https://yourapp.com/icon.png'],
    redirect: {
        native: 'chordially://',
    },
};


const SignupScreen = ({ navigation }) => {
    const { open, isConnected, address, provider } = useWalletConnectModal();

    const handleWalletSignup = async () => {
        try {
            if (isConnected) {


                console.log("Already connected with:", address);

            } else {
                await open();

            }
        } catch (error) {
            console.error("Error signing up with wallet:", error);

        }
    };

    const handleEmailSignup = () => {

        console.log('Navigate to Email Signup Form');

    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chordially</Text>
                <Text style={styles.subtitle}>Find your harmony.</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleWalletSignup}>
                    <Text style={styles.buttonText}>Sign up with Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={handleEmailSignup}>
                    <Text style={styles.buttonText}>Sign up with Email</Text>
                </TouchableOpacity>
            </View>

            {/* WalletConnect Modal Component */}
            <WalletConnectModal projectId={projectId} providerMetadata={providerMetadata} />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 18,
        color: '#B3B3B3',
        marginTop: 10,
    },
    buttonContainer: {
        width: '80%',
    },
    button: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    emailButton: {
        backgroundColor: '#333333',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignupScreen;