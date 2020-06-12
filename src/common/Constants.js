import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Constants = {
    useReactotron: true,
    EmitCode: {
        Toast: 'toast',
    },
};

export default Constants;
