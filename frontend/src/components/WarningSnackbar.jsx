import { useState, forwardRef, useCallback } from "react";
import { styled } from "@mui/system";
import { useSnackbar, SnackbarContent } from "notistack";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";



const WarningSnackbar = forwardRef(({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();
  

    const Root = styled('div')(({ theme }) => ({
        '@media (min-width:600px)': {
          minWidth: '344px !important'
        }
      }));
      
      const StyledCard = styled(Card)({
        width: '100%',
        backgroundColor: '#fddc6c'
      });
      
      const TypographyStyled = styled(Typography)({
        color: '#000'
      });
      
      const ActionRoot = styled(CardActions)({
        padding: '8px 8px 8px 16px',
        justifyContent: 'space-between'
      });
      
      const IconsDiv = styled('div')({
        marginLeft: 'auto'
      });
      
      const ExpandIconButton = styled(IconButton)(({ theme, expanded }) => ({
        padding: '8px 8px',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        color: '#000',
        transition: 'all .2s'
      }));
      
      const PaperStyled = styled(Paper)({
        backgroundColor: '#fff',
        padding: 16
      });
      
      const CheckIcon = styled(CheckCircleIcon)({
        fontSize: 20,
        paddingRight: 4
      });
      
      const CustomButton = styled(Button)({
        padding: 0,
        textTransform: 'none'
      });

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);


  
    return (
      <SnackbarContent ref={ref} component={Root}>
        <StyledCard style={{ backgroundColor: '#f44336', color: '#fff' }}> {/* Red Snackbar */}
          <ActionRoot>
            <TypographyStyled variant="body2" style={{ color: '#fff' }}>
              {props.message}
            </TypographyStyled>
            <IconsDiv>
              <IconButton
                size="small"
                onClick={handleDismiss}
                style={{ color: '#fff' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </IconsDiv>
          </ActionRoot>
        </StyledCard>
      </SnackbarContent>
    );
  });
  
  WarningSnackbar.displayName = "WarningSnackbar";
  
  export default WarningSnackbar;