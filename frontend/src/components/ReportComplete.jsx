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

const ReportComplete = forwardRef(({ id, ...props }, ref) => {
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);
  const messageOf = props.message.includes("Booking Received from") ? "boookingNoti" : "other";
  return (
    <SnackbarContent ref={ref} component={Root}>
      <StyledCard>
        <ActionRoot>
          <TypographyStyled variant="body2">
            {props.message}
          </TypographyStyled>
          <IconsDiv>
            {messageOf !== "boookingNoti" && <ExpandIconButton
              aria-label="Show more"
              size="small"
              expanded={expanded}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </ExpandIconButton>}
            <IconButton
              size="small"
              onClick={handleDismiss}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </IconsDiv>
        </ActionRoot>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <PaperStyled>
            <Typography gutterBottom variant="caption" style={{ color: '#000', display: 'block' }}>
              PDF ready
            </Typography>
            <CustomButton size="small" color="primary">
              <CheckIcon />
              Download now
            </CustomButton>
          </PaperStyled>
        </Collapse>
      </StyledCard>
    </SnackbarContent>
  );
});

ReportComplete.displayName = "ReportComplete";

export default ReportComplete;
