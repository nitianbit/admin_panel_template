import React, { useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';

interface ToggleButtonProps {
    options?: string[];
    onSelect?: (value: string) => void;
}

const ToggleButton = ({ options = [], onSelect }: ToggleButtonProps) => {
    const [selectedRole, setSelectedRole] = useState(options[0]);

    const handleRoleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
        const value = event.currentTarget.value;
        setSelectedRole(value);
        onSelect && onSelect(value);
    };

    return (
        <ButtonGroup variant="contained" aria-label="role-toggle-buttons">
            {options.map((role) => (
                <Button
                    key={role}
                    value={role}
                    onClick={handleRoleSelect}
                    sx={{
                        backgroundColor: selectedRole === role ? 'primary.main' : 'white',
                        color: selectedRole === role ? 'white' : 'primary.main',
                        '&:hover': {
                            backgroundColor: selectedRole === role ? 'primary.dark' : 'grey.100',
                        },
                        border: selectedRole === role ? 'none' : '1px solid primary.main',
                        borderColor: selectedRole !== role ? 'primary.main' : 'grey.300',
                    }}
                >
                    {role}
                </Button>
            ))}
        </ButtonGroup>
    );
};

export default ToggleButton;
